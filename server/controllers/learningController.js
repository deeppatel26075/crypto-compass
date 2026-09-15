/**
 * Crypto Compass — Learning Platform Controller (Phase 13)
 *
 * Exposes authenticated endpoints for learning catalog, lesson reading, and progress completion.
 */

const learningService = require('../services/learningService');

/**
 * GET /api/learning/catalog
 * Returns lightweight metadata for all 15 lessons.
 */
async function getCatalog(req, res, next) {
  try {
    const catalog = learningService.getCatalog();
    return res.status(200).json({
      success: true,
      data: catalog,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/learning/lessons/:lessonId
 * Returns full structured lesson with objectives, sections, and takeaways.
 */
async function getLesson(req, res, next) {
  try {
    const { lessonId } = req.params;
    const lesson = learningService.getLessonById(lessonId);
    return res.status(200).json({
      success: true,
      data: lesson,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        success: false,
        error: err.message,
        code: err.code || 'LESSON_ERROR',
      });
    }
    next(err);
  }
}

/**
 * GET /api/learning/progress
 * Returns authenticated user's completed lesson list.
 */
async function getProgress(req, res, next) {
  try {
    const userId = req.user?._id || req.user?.id;
    const progress = await learningService.getUserProgress(userId);
    return res.status(200).json({
      success: true,
      data: progress,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/learning/progress/:lessonId/complete
 * Atomically marks lesson complete for authenticated user.
 */
async function completeLesson(req, res, next) {
  try {
    const userId = req.user?._id || req.user?.id;
    const { lessonId } = req.params;

    const result = await learningService.completeLesson(userId, lessonId);
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    if (err.status) {
      return res.status(err.status).json({
        success: false,
        error: err.message,
        code: err.code || 'PROGRESS_ERROR',
      });
    }
    next(err);
  }
}

module.exports = {
  getCatalog,
  getLesson,
  getProgress,
  completeLesson,
};
