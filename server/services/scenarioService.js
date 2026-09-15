const ScenarioProgress = require('../models/ScenarioProgress');
const { SCENARIOS } = require('../constants/scenarios');

/**
 * Crypto Compass — Scenario Service (Phase 15)
 *
 * Educational decision-making assessment in realistic educational situations.
 * Strictly educational: zero financial advice, zero predictions, zero XP awarded.
 */

/**
 * Get lightweight catalog of all 10 scenarios
 */
function getScenarioCatalog() {
  return {
    scenarios: SCENARIOS.map((s) => ({
      id: s.id,
      lessonId: s.lessonId,
      title: s.title,
      category: s.category,
      categoryLabel: s.categoryLabel,
      difficulty: s.difficulty,
      estimatedMinutes: s.estimatedMinutes,
      description: s.description,
      optionCount: s.options.length,
    })),
    totalCount: SCENARIOS.length,
  };
}

/**
 * Get scenario details without revealing answers or educational evaluation
 * @param {string} scenarioId
 */
function getScenarioById(scenarioId) {
  if (!scenarioId || typeof scenarioId !== 'string') {
    const err = new Error('Scenario ID is required.');
    err.status = 400;
    throw err;
  }

  const cleanId = scenarioId.trim().toLowerCase();
  const scenario = SCENARIOS.find((s) => s.id === cleanId || s.lessonId === cleanId);

  if (!scenario) {
    const err = new Error(`Scenario "${cleanId}" not found.`);
    err.status = 404;
    err.code = 'SCENARIO_NOT_FOUND';
    throw err;
  }

  // Security Invariant: Omit educationalQuality, explanation, and answer indicators before submission
  return {
    id: scenario.id,
    lessonId: scenario.lessonId,
    title: scenario.title,
    category: scenario.category,
    categoryLabel: scenario.categoryLabel,
    difficulty: scenario.difficulty,
    estimatedMinutes: scenario.estimatedMinutes,
    description: scenario.description,
    context: scenario.context,
    question: scenario.question,
    options: scenario.options.map((opt) => ({
      id: opt.id,
      text: opt.text,
    })),
  };
}

/**
 * Retrieve authenticated user's scenario progress
 * @param {string|Object} userId
 */
async function getScenarioProgress(userId) {
  if (!userId) {
    const err = new Error('User ID is required to retrieve scenario progress.');
    err.status = 401;
    throw err;
  }

  const progress = await ScenarioProgress.findOne({ user: userId });
  if (!progress) {
    return {
      completedScenarios: [],
      completedCount: 0,
      scenarioResults: [],
      totalAvailableScenarios: SCENARIOS.length,
      lastCompletedAt: null,
    };
  }

  return {
    completedScenarios: progress.completedScenarios || [],
    completedCount: (progress.completedScenarios || []).length,
    scenarioResults: progress.scenarioResults || [],
    totalAvailableScenarios: SCENARIOS.length,
    lastCompletedAt: progress.lastCompletedAt,
  };
}

/**
 * Server-authoritative scenario evaluation and atomic progress persistence.
 *
 * Semantic Rules:
 * - NO XP is awarded (zero XP in Phase 15).
 * - Repeated submissions must be strictly idempotent for BOTH completedScenarios and scenarioResults.
 * - Under concurrent identical submissions, exactly one record exists in completedScenarios and scenarioResults.
 *
 * @param {string|Object} userId
 * @param {string} scenarioId
 * @param {string} optionId
 */
async function submitScenario(userId, scenarioId, optionId) {
  if (!userId) {
    const err = new Error('User ID is required to submit scenario.');
    err.status = 401;
    throw err;
  }

  if (!scenarioId || typeof scenarioId !== 'string') {
    const err = new Error('Scenario ID is required.');
    err.status = 400;
    throw err;
  }

  const cleanScenarioId = scenarioId.trim().toLowerCase();
  const scenario = SCENARIOS.find((s) => s.id === cleanScenarioId || s.lessonId === cleanScenarioId);

  if (!scenario) {
    const err = new Error(`Cannot submit decision for invalid scenario "${cleanScenarioId}".`);
    err.status = 404;
    err.code = 'INVALID_SCENARIO_ID';
    throw err;
  }

  if (!optionId || typeof optionId !== 'string') {
    const err = new Error('Option ID is required.');
    err.status = 400;
    err.code = 'INVALID_OPTION_ID';
    throw err;
  }

  const cleanOptionId = optionId.trim();
  const option = scenario.options.find((opt) => opt.id === cleanOptionId);

  if (!option) {
    const err = new Error(`Invalid option ID "${cleanOptionId}" for scenario "${scenario.id}".`);
    err.status = 400;
    err.code = 'INVALID_OPTION_ID';
    throw err;
  }

  // 1. Ensure user progress document exists
  await ScenarioProgress.updateOne(
    { user: userId },
    { $setOnInsert: { user: userId, completedScenarios: [], scenarioResults: [] } },
    { upsert: true }
  );

  const now = new Date();

  // 2. Concurrency-safe, idempotent atomic persistence:
  // Step A: Attempt in-place update if this scenario already has a result in scenarioResults
  let progressDoc = await ScenarioProgress.findOneAndUpdate(
    { user: userId, 'scenarioResults.scenarioId': scenario.id },
    {
      $set: {
        'scenarioResults.$.selectedOptionId': option.id,
        'scenarioResults.$.educationalQuality': option.educationalQuality,
        'scenarioResults.$.completedAt': now,
        lastCompletedAt: now,
      },
      $addToSet: { completedScenarios: scenario.id },
    },
    { new: true }
  );

  // Step B: If no existing entry for this scenarioId, atomically push ONLY if not present
  if (!progressDoc) {
    progressDoc = await ScenarioProgress.findOneAndUpdate(
      { user: userId, 'scenarioResults.scenarioId': { $ne: scenario.id } },
      {
        $addToSet: { completedScenarios: scenario.id },
        $push: {
          scenarioResults: {
            scenarioId: scenario.id,
            selectedOptionId: option.id,
            educationalQuality: option.educationalQuality,
            completedAt: now,
          },
        },
        $set: { lastCompletedAt: now },
      },
      { new: true }
    );

    // Step C: Fallback in case a concurrent request inserted between Step A and Step B
    if (!progressDoc) {
      progressDoc = await ScenarioProgress.findOneAndUpdate(
        { user: userId, 'scenarioResults.scenarioId': scenario.id },
        {
          $set: {
            'scenarioResults.$.selectedOptionId': option.id,
            'scenarioResults.$.educationalQuality': option.educationalQuality,
            'scenarioResults.$.completedAt': now,
            lastCompletedAt: now,
          },
          $addToSet: { completedScenarios: scenario.id },
        },
        { new: true }
      );
    }
  }

  // Return server-authoritative educational evaluation
  return {
    scenarioId: scenario.id,
    selectedOptionId: option.id,
    educationalQuality: option.educationalQuality,
    explanation: option.explanation,
    keyConcepts: scenario.keyConcepts || [],
    completedScenarios: progressDoc?.completedScenarios || [scenario.id],
  };
}

module.exports = {
  getScenarioCatalog,
  getScenarioById,
  getScenarioProgress,
  submitScenario,
};
