const mongoose = require('mongoose');

const challengeProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required for challenge progress.'],
      unique: true,
      index: true,
    },
    completedChallenges: [
      {
        type: String,
        trim: true,
      },
    ],
    totalChallengeXp: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastUpdatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Returns sanitized client-safe challenge progress
 */
challengeProgressSchema.methods.toSafeJSON = function () {
  return {
    completedChallenges: this.completedChallenges || [],
    completedCount: (this.completedChallenges || []).length,
    totalChallengeXp: this.totalChallengeXp || 0,
    lastUpdatedAt: this.lastUpdatedAt,
  };
};

module.exports = mongoose.model('ChallengeProgress', challengeProgressSchema);
