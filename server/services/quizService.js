const QuizProgress = require('../models/QuizProgress');
const { QUIZZES } = require('../constants/quizzes');

/**
 * Get lightweight catalog of all 15 quizzes
 */
function getQuizCatalog() {
  return {
    quizzes: QUIZZES.map((q) => ({
      id: q.id,
      lessonId: q.lessonId,
      title: q.title,
      category: q.category,
      categoryLabel: q.categoryLabel,
      difficulty: q.difficulty,
      estimatedMinutes: q.estimatedMinutes,
      description: q.description,
      totalQuestions: q.questions.length,
    })),
    totalCount: QUIZZES.length,
  };
}

/**
 * Get quiz questions without revealing correct answers (pre-submission security)
 * @param {string} quizId
 */
function getQuizById(quizId) {
  if (!quizId || typeof quizId !== 'string') {
    const err = new Error('Quiz ID is required.');
    err.status = 400;
    throw err;
  }

  const cleanId = quizId.trim().toLowerCase();
  const quiz = QUIZZES.find((q) => q.id === cleanId || q.lessonId === cleanId);

  if (!quiz) {
    const err = new Error(`Quiz "${cleanId}" not found.`);
    err.status = 404;
    err.code = 'QUIZ_NOT_FOUND';
    throw err;
  }

  // Security Invariant: Omit correctOptionId and explanation before submission
  return {
    id: quiz.id,
    lessonId: quiz.lessonId,
    title: quiz.title,
    category: quiz.category,
    categoryLabel: quiz.categoryLabel,
    difficulty: quiz.difficulty,
    estimatedMinutes: quiz.estimatedMinutes,
    description: quiz.description,
    totalQuestions: quiz.questions.length,
    questions: quiz.questions.map((q) => ({
      id: q.id,
      question: q.question,
      options: q.options.map((opt) => ({
        id: opt.id,
        text: opt.text,
      })),
    })),
  };
}

/**
 * Retrieve authenticated user's quiz progress
 * @param {string|Object} userId
 */
async function getQuizProgress(userId) {
  if (!userId) {
    const err = new Error('User ID is required to retrieve quiz progress.');
    err.status = 401;
    throw err;
  }

  const progress = await QuizProgress.findOne({ user: userId });
  if (!progress) {
    return {
      completedQuizzes: [],
      completedCount: 0,
      totalXp: 0,
      quizResults: [],
      totalAvailableQuizzes: QUIZZES.length,
    };
  }

  return {
    completedQuizzes: progress.completedQuizzes || [],
    completedCount: (progress.completedQuizzes || []).length,
    totalXp: progress.totalXp || 0,
    quizResults: progress.quizResults || [],
    totalAvailableQuizzes: QUIZZES.length,
    lastCompletedAt: progress.lastCompletedAt,
  };
}

/**
 * Server-authoritative quiz evaluation and atomic XP awarding.
 *
 * Semantic Rules:
 * - 5 questions, 1 pt each, max = 5.
 * - Passing threshold: >= 80% (4/5 or 5/5).
 * - If passed === false: earnedXp = 0, quiz NOT added to completedQuizzes.
 * - If passed === true:
 *     - If quiz NOT previously in completedQuizzes: earnedXp = 100, totalXp += 100, add to completedQuizzes.
 *     - If quiz ALREADY in completedQuizzes: earnedXp = 0.
 *
 * @param {string|Object} userId
 * @param {string} quizId
 * @param {Array<{ questionId: string, selectedOptionId: string }>} answers
 */
async function submitQuiz(userId, quizId, answers) {
  if (!userId) {
    const err = new Error('User ID is required to submit quiz.');
    err.status = 401;
    throw err;
  }

  if (!quizId || typeof quizId !== 'string') {
    const err = new Error('Quiz ID is required.');
    err.status = 400;
    throw err;
  }

  const cleanId = quizId.trim().toLowerCase();
  const quiz = QUIZZES.find((q) => q.id === cleanId || q.lessonId === cleanId);

  if (!quiz) {
    const err = new Error(`Cannot submit answers for invalid quiz "${cleanId}".`);
    err.status = 404;
    err.code = 'INVALID_QUIZ_ID';
    throw err;
  }

  if (!Array.isArray(answers)) {
    const err = new Error('Answers must be provided as an array.');
    err.status = 400;
    throw err;
  }

  // Validate question and option IDs
  const validQuestionIds = new Set(quiz.questions.map((q) => q.id));
  const answersMap = new Map();

  for (const item of answers) {
    if (!item || !item.questionId) {
      continue;
    }
    if (!validQuestionIds.has(item.questionId)) {
      const err = new Error(`Invalid question ID "${item.questionId}" for this quiz.`);
      err.status = 400;
      err.code = 'INVALID_QUESTION_ID';
      throw err;
    }

    const question = quiz.questions.find((q) => q.id === item.questionId);
    if (item.selectedOptionId) {
      const validOption = question.options.some((opt) => opt.id === item.selectedOptionId);
      if (!validOption) {
        const err = new Error(`Invalid option ID "${item.selectedOptionId}" for question "${item.questionId}".`);
        err.status = 400;
        err.code = 'INVALID_OPTION_ID';
        throw err;
      }
      answersMap.set(item.questionId, item.selectedOptionId);
    }
  }

  // Deterministic evaluation against server answer key
  let score = 0;
  const explanations = quiz.questions.map((q) => {
    const selectedOptionId = answersMap.get(q.id) || null;
    const isCorrect = selectedOptionId === q.correctOptionId;
    if (isCorrect) score += 1;

    return {
      questionId: q.id,
      selectedOptionId,
      correctOptionId: q.correctOptionId,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const totalQuestions = quiz.questions.length;
  const percentage = Math.round((score / totalQuestions) * 100);
  const passed = percentage >= 80; // 4/5 or 5/5

  // Ensure QuizProgress document exists for this user
  await QuizProgress.updateOne(
    { user: userId },
    {
      $setOnInsert: {
        user: userId,
        completedQuizzes: [],
        totalXp: 0,
        quizResults: [],
      },
    },
    { upsert: true }
  );

  let earnedXp = 0;

  // Atomic XP award: awarded ONLY upon passing, and ONLY once per quiz
  if (passed) {
    const awardResult = await QuizProgress.findOneAndUpdate(
      {
        user: userId,
        completedQuizzes: { $ne: quiz.id },
      },
      {
        $addToSet: { completedQuizzes: quiz.id },
        $inc: { totalXp: 100 },
        $set: { lastCompletedAt: new Date() },
      },
      { new: true }
    );

    if (awardResult) {
      earnedXp = 100;
    } else {
      earnedXp = 0; // Already previously passed and awarded XP
    }
  }

  // Record this attempt in quizResults history
  const updatedProgress = await QuizProgress.findOneAndUpdate(
    { user: userId },
    {
      $push: {
        quizResults: {
          quizId: quiz.id,
          score,
          totalQuestions,
          percentage,
          passed,
          earnedXp,
          completedAt: new Date(),
        },
      },
    },
    { new: true }
  );

  return {
    quizId: quiz.id,
    lessonId: quiz.lessonId,
    title: quiz.title,
    score,
    totalQuestions,
    percentage,
    passed,
    earnedXp,
    totalXp: updatedProgress?.totalXp || 0,
    isCompleted: (updatedProgress?.completedQuizzes || []).includes(quiz.id),
    explanations,
  };
}

module.exports = {
  getQuizCatalog,
  getQuizById,
  getQuizProgress,
  submitQuiz,
};
