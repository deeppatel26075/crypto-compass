/**
 * Crypto Compass — Adaptive Learning Service (Phase 18)
 *
 * Deterministically generates educational recommendations answering:
 * "What should I learn or review next?"
 *
 * Key Principles:
 * - 100% Deterministic (Zero AI, Zero LLM, Zero ML).
 * - Ephemeral & Read-Only (Zero new DB collections, Zero DB writes).
 * - Zero Side-Effects (Zero wallet, trade, holding, XP, or progress mutations).
 * - Zero Market Data Dependencies (Completely offline from CoinGecko/prices).
 * - Strictly Educational (Zero financial advice, zero buy/sell recommendations).
 * - Guarded Terminology (Preserves Phase 17 FOMO, Position Sizing, and Concentration guards).
 */

const { LESSONS } = require('../constants/lessons');
const { QUIZZES } = require('../constants/quizzes');
const { SCENARIOS } = require('../constants/scenarios');
const LearningProgress = require('../models/LearningProgress');
const QuizProgress = require('../models/QuizProgress');
const ScenarioProgress = require('../models/ScenarioProgress');
const { getUserTradeAnalysis } = require('./analysisService');

// Pre-index catalogs for efficient O(1) lookups
const lessonById = new Map(LESSONS.map((l, index) => [l.id, { ...l, index }]));
const quizById = new Map(QUIZZES.map((q) => [q.id, q]));
const scenarioById = new Map(SCENARIOS.map((s) => [s.id, s]));

// Mappings by lessonId
const quizByLessonId = new Map();
QUIZZES.forEach((q) => {
  if (q.lessonId) quizByLessonId.set(q.lessonId, q);
});

const scenarioByLessonId = new Map();
SCENARIOS.forEach((s) => {
  if (s.lessonId) scenarioByLessonId.set(s.lessonId, s);
});

// Phase 17 Observation Category -> Lesson ID Mapping
const BEHAVIOR_LESSON_MAP = {
  OVERTRADING: 'common-beginner-mistakes',
  RAPID_ENTRY_EXIT: 'trading-with-a-plan',
  CONCENTRATION: 'position-sizing-basics',
  POSITION_SIZING: 'position-sizing-basics',
  FOMO_PATTERN: 'trading-with-a-plan',
};

// Guarded educational behavioral rationales
const BEHAVIOR_RATIONALES = {
  FOMO_PATTERN:
    'The Mistake Analyzer identified a potential FOMO-style pattern in recent simulated trades. Studying this lesson will help you build disciplined entry rules.',
  OVERTRADING:
    'The Mistake Analyzer identified high-frequency trading patterns. Reviewing this lesson can help you build structured execution patience.',
  CONCENTRATION:
    'The Mistake Analyzer identified trading-volume concentration in your historical trades. This lesson covers risk distribution principles.',
  POSITION_SIZING:
    'The Mistake Analyzer identified large simulated order sizes relative to virtual starting capital. This lesson covers position sizing fundamentals.',
  RAPID_ENTRY_EXIT:
    'The Mistake Analyzer identified rapid entry and exit patterns. This lesson explains how to formulate and stick to a trade plan.',
};

const PRIORITY_RANKS = {
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

const TYPE_PRECEDENCE = {
  BEHAVIOR_REVIEW: 1,
  QUIZ_REVIEW: 2,
  SCENARIO_REVIEW: 3,
  FOUNDATIONS_REVIEW: 4,
  NEXT_LESSON: 5,
};

/**
 * Deterministically generates adaptive educational recommendations for a user.
 *
 * @param {string|Object} userId - Authenticated user ObjectId
 * @returns {Promise<Object>} Clean recommendations array and learning state summary
 */
async function getAdaptiveRecommendations(userId) {
  if (!userId) {
    const err = new Error('User authentication identity is required.');
    err.status = 401;
    throw err;
  }

  // 1. Parallel read-only fetch of user's learning state across existing models
  const [learningProg, quizProg, scenarioProg, tradeAnalysis] = await Promise.all([
    LearningProgress.findOne({ user: userId }).lean().catch(() => null),
    QuizProgress.findOne({ user: userId }).lean().catch(() => null),
    ScenarioProgress.findOne({ user: userId }).lean().catch(() => null),
    getUserTradeAnalysis(userId).catch(() => null),
  ]);

  const completedLessons = Array.isArray(learningProg?.completedLessons)
    ? learningProg.completedLessons
    : [];
  const completedSet = new Set(completedLessons);

  const completedQuizzes = Array.isArray(quizProg?.completedQuizzes)
    ? quizProg.completedQuizzes
    : [];
  const quizResults = Array.isArray(quizProg?.quizResults) ? quizProg.quizResults : [];

  const completedScenarios = Array.isArray(scenarioProg?.completedScenarios)
    ? scenarioProg.completedScenarios
    : [];
  const scenarioResults = Array.isArray(scenarioProg?.scenarioResults)
    ? scenarioProg.scenarioResults
    : [];

  const rawCandidates = [];

  const isCurriculumComplete = completedLessons.length >= LESSONS.length;

  // =========================================================================
  // RULE A — FOUNDATIONAL START
  // =========================================================================
  if (completedLessons.length === 0) {
    const firstLesson = LESSONS[0];
    rawCandidates.push({
      ruleKey: 'FOUNDATIONS_START',
      type: 'FOUNDATIONS_REVIEW',
      priority: 'HIGH',
      title: 'Start with Crypto Fundamentals',
      description: firstLesson.description,
      reason: 'You have not completed any lessons yet. Start here to build your core crypto foundations.',
      lessonId: firstLesson.id,
      quizId: quizByLessonId.get(firstLesson.id)?.id || null,
      scenarioId: scenarioByLessonId.get(firstLesson.id)?.id || null,
    });
  }

  // =========================================================================
  // RULE B — INCOMPLETE LESSONS (Curriculum Progression)
  // =========================================================================
  if (completedLessons.length > 0 && !isCurriculumComplete) {
    const nextIncomplete = LESSONS.find((l) => !completedSet.has(l.id));
    if (nextIncomplete) {
      rawCandidates.push({
        ruleKey: 'NEXT_LESSON',
        type: 'NEXT_LESSON',
        priority: 'MEDIUM',
        title: `Next Up: ${nextIncomplete.title}`,
        description: nextIncomplete.description,
        reason: 'Next recommended lesson in your structured curriculum to advance your crypto knowledge.',
        lessonId: nextIncomplete.id,
        quizId: quizByLessonId.get(nextIncomplete.id)?.id || null,
        scenarioId: scenarioByLessonId.get(nextIncomplete.id)?.id || null,
      });
    }
  }

  // =========================================================================
  // RULE C & RULE D — QUIZ RESULTS (Failed & Weak Pass)
  // =========================================================================
  quizResults.forEach((res) => {
    if (!res || !res.quizId) return;
    const quiz = quizById.get(res.quizId);
    if (!quiz || !quiz.lessonId) return;
    const lesson = lessonById.get(quiz.lessonId);
    if (!lesson) return;

    // RULE C: Failed Quiz (<80% or passed === false)
    const isFailed = res.passed === false || (typeof res.percentage === 'number' && res.percentage < 80);
    if (isFailed) {
      rawCandidates.push({
        ruleKey: 'QUIZ_FAILED',
        type: 'QUIZ_REVIEW',
        priority: 'HIGH',
        title: `Review ${lesson.title}`,
        description: lesson.description,
        reason: 'Your previous quiz result was below the passing threshold. Revisit this lesson to strengthen your understanding.',
        lessonId: lesson.id,
        quizId: quiz.id,
        scenarioId: scenarioByLessonId.get(lesson.id)?.id || null,
      });
      return;
    }

    // RULE D: Passed Quiz but Weak Result (>=80% and <90%)
    const isWeakPass =
      res.passed === true &&
      typeof res.percentage === 'number' &&
      res.percentage >= 80 &&
      res.percentage < 90;
    if (isWeakPass) {
      rawCandidates.push({
        ruleKey: 'QUIZ_WEAK_PASS',
        type: 'QUIZ_REVIEW',
        priority: 'MEDIUM',
        title: `Reinforce ${lesson.title}`,
        description: lesson.description,
        reason: 'You passed this quiz, but an optional review can help solidify key concepts.',
        lessonId: lesson.id,
        quizId: quiz.id,
        scenarioId: scenarioByLessonId.get(lesson.id)?.id || null,
      });
    }
  });

  // =========================================================================
  // RULE E — SCENARIO REVIEW (Strict Data Integrity Guard)
  // Only triggers when explicit educationalQuality is 'RISKY' or 'UNHELPFUL'.
  // =========================================================================
  scenarioResults.forEach((res) => {
    if (!res || !res.scenarioId) return;
    const quality = res.educationalQuality;
    // Strict Guard: missing, undefined, incomplete, STRONG, or REASONABLE do NOT trigger review
    if (quality === 'RISKY' || quality === 'UNHELPFUL') {
      const scenario = scenarioById.get(res.scenarioId);
      if (!scenario || !scenario.lessonId) return;
      const lesson = lessonById.get(scenario.lessonId);
      if (!lesson) return;

      rawCandidates.push({
        ruleKey: 'SCENARIO_REVIEW',
        type: 'SCENARIO_REVIEW',
        priority: 'MEDIUM',
        title: `Revisit ${lesson.title}`,
        description: lesson.description,
        reason: 'Your recent scenario decision suggests this core concept may be worth revisiting for deeper practical insight.',
        lessonId: lesson.id,
        quizId: quizByLessonId.get(lesson.id)?.id || null,
        scenarioId: scenario.id,
      });
    }
  });

  // =========================================================================
  // RULE F — BEHAVIORAL LEARNING GAP (Phase 17 Mistake Analyzer Integration)
  // =========================================================================
  if (tradeAnalysis && Array.isArray(tradeAnalysis.observations)) {
    tradeAnalysis.observations.forEach((obs) => {
      const mappedLessonId = BEHAVIOR_LESSON_MAP[obs.category];
      if (!mappedLessonId) return;
      const lesson = lessonById.get(mappedLessonId);
      if (!lesson) return;

      const isLessonCompleted = completedSet.has(mappedLessonId);
      const rationale =
        BEHAVIOR_RATIONALES[obs.category] ||
        'The Mistake Analyzer identified an educational trading pattern related to this topic.';

      if (!isLessonCompleted) {
        // High priority review candidate if not yet completed
        rawCandidates.push({
          ruleKey: 'BEHAVIOR_GAP',
          type: 'BEHAVIOR_REVIEW',
          priority: 'HIGH',
          title: `Study ${lesson.title}`,
          description: lesson.description,
          reason: rationale,
          lessonId: lesson.id,
          quizId: quizByLessonId.get(lesson.id)?.id || null,
          scenarioId: scenarioByLessonId.get(lesson.id)?.id || null,
        });
      }
      // If completed, prompt mandates suppressing repetitive high-priority recommendation
    });
  }

  // =========================================================================
  // RULE G — COMPLETED CURRICULUM FILTER
  // If all 15 lessons are complete, suppress NEXT_LESSON and FOUNDATIONS_REVIEW.
  // =========================================================================
  let eligibleCandidates = rawCandidates;
  if (isCurriculumComplete) {
    eligibleCandidates = rawCandidates.filter(
      (c) => c.type !== 'NEXT_LESSON' && c.type !== 'FOUNDATIONS_REVIEW'
    );
  }

  // =========================================================================
  // DEDUPLICATION & MERGING
  // Merge multiple candidate triggers for the same lesson into a single item.
  // =========================================================================
  const groupedByLesson = new Map();

  eligibleCandidates.forEach((cand) => {
    if (!groupedByLesson.has(cand.lessonId)) {
      groupedByLesson.set(cand.lessonId, []);
    }
    groupedByLesson.get(cand.lessonId).push(cand);
  });

  const mergedRecommendations = [];

  for (const [lessonId, candidates] of groupedByLesson.entries()) {
    const lesson = lessonById.get(lessonId);
    if (!lesson) continue;

    // 1. Determine highest priority among candidates
    let highestPriority = 'LOW';
    let bestPriorityRank = 999;
    candidates.forEach((c) => {
      const rank = PRIORITY_RANKS[c.priority] || 999;
      if (rank < bestPriorityRank) {
        bestPriorityRank = rank;
        highestPriority = c.priority;
      }
    });

    // 2. Determine best type among candidates
    let bestType = candidates[0].type;
    let bestTypeRank = 999;
    candidates.forEach((c) => {
      const rank = TYPE_PRECEDENCE[c.type] || 999;
      if (rank < bestTypeRank) {
        bestTypeRank = rank;
        bestType = c.type;
      }
    });

    // 3. Resolve IDs
    const quizId = candidates.find((c) => c.quizId)?.quizId || quizByLessonId.get(lessonId)?.id || null;
    const scenarioId =
      candidates.find((c) => c.scenarioId)?.scenarioId || scenarioByLessonId.get(lessonId)?.id || null;

    // 4. Combine reasons seamlessly
    const ruleKeys = new Set(candidates.map((c) => c.ruleKey));
    let mergedReason = candidates[0].reason;

    if (ruleKeys.has('QUIZ_FAILED') && ruleKeys.has('BEHAVIOR_GAP')) {
      mergedReason =
        'Your quiz results and recent simulated trading patterns both suggest this topic may benefit from another review.';
    } else if (ruleKeys.has('QUIZ_FAILED') && ruleKeys.has('SCENARIO_REVIEW')) {
      mergedReason =
        'Your quiz performance and scenario decision both suggest this topic may benefit from another review.';
    } else if (ruleKeys.has('BEHAVIOR_GAP') && ruleKeys.has('SCENARIO_REVIEW')) {
      mergedReason =
        'Your recent scenario outcome and simulated trading patterns both highlight this concept for review.';
    } else if (ruleKeys.has('QUIZ_FAILED')) {
      mergedReason =
        'Your previous quiz result was below the passing threshold. Revisit this lesson to strengthen your understanding.';
    } else if (ruleKeys.has('BEHAVIOR_GAP')) {
      const behaviorCand = candidates.find((c) => c.ruleKey === 'BEHAVIOR_GAP');
      mergedReason = behaviorCand ? behaviorCand.reason : mergedReason;
    }

    // Title selection based on bestType
    let mergedTitle = `Review ${lesson.title}`;
    if (bestType === 'FOUNDATIONS_REVIEW') {
      mergedTitle = 'Start with Crypto Fundamentals';
    } else if (bestType === 'NEXT_LESSON') {
      mergedTitle = `Next Up: ${lesson.title}`;
    } else if (bestType === 'BEHAVIOR_REVIEW') {
      mergedTitle = `Study ${lesson.title}`;
    } else if (bestType === 'QUIZ_REVIEW' && ruleKeys.has('QUIZ_WEAK_PASS') && !ruleKeys.has('QUIZ_FAILED')) {
      mergedTitle = `Reinforce ${lesson.title}`;
    }

    mergedRecommendations.push({
      id: `rec-${bestType.toLowerCase().replace(/_/g, '-')}-${lesson.id}`,
      type: bestType,
      priority: highestPriority,
      title: mergedTitle,
      description: lesson.description,
      reason: mergedReason,
      lessonId: lesson.id,
      category: lesson.category,
      categoryLabel: lesson.categoryLabel,
      quizId,
      scenarioId,
      _curriculumIndex: lesson.index,
    });
  }

  // =========================================================================
  // DETERMINISTIC SORTING & CAPPING
  // Order: Priority (HIGH -> MEDIUM -> LOW), then Curriculum Order (index in LESSONS).
  // Cap at 5 recommendations.
  // =========================================================================
  mergedRecommendations.sort((a, b) => {
    const rankDiff = PRIORITY_RANKS[a.priority] - PRIORITY_RANKS[b.priority];
    if (rankDiff !== 0) return rankDiff;
    return a._curriculumIndex - b._curriculumIndex;
  });

  const finalRecommendations = mergedRecommendations.slice(0, 5).map((r) => {
    const { _curriculumIndex, ...cleanObj } = r;
    return cleanObj;
  });

  // Factual Learning State
  const learningState = {
    completedLessons: completedLessons.length,
    totalLessons: LESSONS.length,
    completedQuizzes: completedQuizzes.length,
    totalQuizzes: QUIZZES.length,
    completedScenarios: completedScenarios.length,
    totalScenarios: SCENARIOS.length,
    isCurriculumComplete,
    hasRecommendations: finalRecommendations.length > 0,
  };

  return {
    recommendations: finalRecommendations,
    learningState,
  };
}

module.exports = {
  getAdaptiveRecommendations,
  BEHAVIOR_LESSON_MAP,
  BEHAVIOR_RATIONALES,
};
