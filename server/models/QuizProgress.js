const mongoose = require('mongoose');

const quizResultItemSchema = new mongoose.Schema(
  {
    quizId: {
      type: String,
      required: true,
      trim: true,
    },
    score: {
      type: Number,
      required: true,
      min: 0,
      max: 5,
    },
    totalQuestions: {
      type: Number,
      required: true,
      default: 5,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    passed: {
      type: Boolean,
      required: true,
    },
    earnedXp: {
      type: Number,
      required: true,
      default: 0,
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const quizProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required for quiz progress.'],
      unique: true,
      index: true,
    },
    completedQuizzes: [
      {
        type: String,
        trim: true,
      },
    ],
    totalXp: {
      type: Number,
      default: 0,
      min: 0,
    },
    quizResults: [quizResultItemSchema],
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
 * Returns sanitized client-safe quiz progress
 */
quizProgressSchema.methods.toSafeJSON = function () {
  return {
    completedQuizzes: this.completedQuizzes || [],
    completedCount: (this.completedQuizzes || []).length,
    totalXp: this.totalXp || 0,
    quizResults: this.quizResults || [],
    lastCompletedAt: this.lastCompletedAt,
  };
};

module.exports = mongoose.model('QuizProgress', quizProgressSchema);
