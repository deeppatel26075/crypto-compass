const mongoose = require('mongoose');

const learningProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required for learning progress.'],
      unique: true,
      index: true,
    },
    completedLessons: [
      {
        type: String,
        trim: true,
      },
    ],
    lastCompletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Returns sanitized client-safe learning progress
 */
learningProgressSchema.methods.toSafeJSON = function () {
  return {
    completedLessons: this.completedLessons || [],
    completedCount: (this.completedLessons || []).length,
    lastCompletedAt: this.lastCompletedAt,
  };
};

module.exports = mongoose.model('LearningProgress', learningProgressSchema);
