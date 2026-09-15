const quizService = require('../services/quizService');

/**
 * GET /api/quizzes/catalog
 * Returns lightweight catalog of all 15 quizzes
 */
async function getCatalog(req, res, next) {
  try {
    const catalog = quizService.getQuizCatalog();
    return res.status(200).json({
      success: true,
      data: catalog,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/quizzes/:quizId
 * Returns quiz questions with answer keys stripped
 */
async function getQuiz(req, res, next) {
  try {
    const { quizId } = req.params;
    const quiz = quizService.getQuizById(quizId);
    return res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        success: false,
        error: err.message,
        code: err.code || 'QUIZ_ERROR',
      });
    }
    next(err);
  }
}

/**
 * GET /api/quizzes/progress
 * Returns user completed quizzes, XP, and attempt history
 */
async function getProgress(req, res, next) {
  try {
    const userId = req.user?._id || req.user?.id;
    const progress = await quizService.getQuizProgress(userId);
    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/quizzes/:quizId/submit
 * Evaluates answers against server answer key and atomically awards XP if passed
 */
async function submitQuiz(req, res, next) {
  try {
    const userId = req.user?._id || req.user?.id;
    const { quizId } = req.params;
    const { answers } = req.body || {};

    const result = await quizService.submitQuiz(userId, quizId, answers);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        success: false,
        error: err.message,
        code: err.code || 'QUIZ_SUBMIT_ERROR',
      });
    }
    next(err);
  }
}

module.exports = {
  getCatalog,
  getQuiz,
  getProgress,
  submitQuiz,
};
