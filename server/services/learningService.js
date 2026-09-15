/**
 * Crypto Compass — Learning Platform Service (Phase 13)
 *
 * Provides access to the 15-lesson structured educational academy and
 * manages atomic, idempotent lesson completion persistence in LearningProgress.
 *
 * Strictly educational: zero XP, zero quizzes, zero financial advice.
 */

const { LESSONS, CATEGORIES } = require('../constants/lessons');
const LearningProgress = require('../models/LearningProgress');

/**
 * Get lightweight catalog metadata for all lessons
 * Omits detailed sections to keep initial catalog payload lightweight.
 */
function getCatalog() {
  const metadata = LESSONS.map((l) => ({
    id: l.id,
    title: l.title,
    category: l.category,
    categoryLabel: l.categoryLabel,
    difficulty: l.difficulty,
    estimatedMinutes: l.estimatedMinutes,
    description: l.description,
  }));

  return {
    categories: Object.values(CATEGORIES),
    lessons: metadata,
    totalLessons: metadata.length,
  };
}

/**
 * Get full detailed lesson by stable ID
 * @param {string} lessonId
 */
function getLessonById(lessonId) {
  if (!lessonId || typeof lessonId !== 'string') {
    const err = new Error('Lesson ID is required.');
    err.status = 400;
    throw err;
  }

  const cleanId = lessonId.trim().toLowerCase();
  const lesson = LESSONS.find((l) => l.id === cleanId);

  if (!lesson) {
    const err = new Error(`Lesson "${cleanId}" not found.`);
    err.status = 404;
    err.code = 'LESSON_NOT_FOUND';
    throw err;
  }

  return lesson;
}

/**
 * Get authenticated user's completed lesson IDs
 * @param {string|Object} userId
 */
async function getUserProgress(userId) {
  if (!userId) {
    const err = new Error('User ID is required to retrieve learning progress.');
    err.status = 401;
    throw err;
  }

  const progress = await LearningProgress.findOne({ user: userId });
  if (!progress) {
    return {
      completedLessons: [],
      completedCount: 0,
      totalLessons: LESSONS.length,
    };
  }

  return {
    completedLessons: progress.completedLessons || [],
    completedCount: (progress.completedLessons || []).length,
    totalLessons: LESSONS.length,
    lastCompletedAt: progress.lastCompletedAt,
  };
}

/**
 * Atomically mark a lesson complete for the authenticated user.
 * Idempotent: duplicate calls leave completedLessons containing lessonId exactly once.
 *
 * @param {string|Object} userId
 * @param {string} lessonId
 */
async function completeLesson(userId, lessonId) {
  if (!userId) {
    const err = new Error('User ID is required to mark lesson complete.');
    err.status = 401;
    throw err;
  }

  if (!lessonId || typeof lessonId !== 'string') {
    const err = new Error('Lesson ID is required.');
    err.status = 400;
    throw err;
  }

  const cleanId = lessonId.trim().toLowerCase();
  const exists = LESSONS.some((l) => l.id === cleanId);
  if (!exists) {
    const err = new Error(`Cannot complete invalid lesson "${cleanId}".`);
    err.status = 404;
    err.code = 'INVALID_LESSON_ID';
    throw err;
  }

  // Atomic idempotency via $addToSet
  const updatedProgress = await LearningProgress.findOneAndUpdate(
    { user: userId },
    {
      $addToSet: { completedLessons: cleanId },
      $set: { lastCompletedAt: new Date() },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return {
    success: true,
    completedLessons: updatedProgress.completedLessons || [],
    completedCount: (updatedProgress.completedLessons || []).length,
    totalLessons: LESSONS.length,
    lastCompletedLesson: cleanId,
  };
}

module.exports = {
  getCatalog,
  getLessonById,
  getUserProgress,
  completeLesson,
};
