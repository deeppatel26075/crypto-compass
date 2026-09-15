const mongoose = require('mongoose');

const unlockedAchievementItemSchema = new mongoose.Schema(
  {
    achievementId: {
      type: String,
      required: true,
      trim: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const achievementProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required for achievement progress.'],
      unique: true,
      index: true,
    },
    unlockedAchievements: [unlockedAchievementItemSchema],
    totalAchievementXp: {
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
 * Returns sanitized client-safe achievement progress
 */
achievementProgressSchema.methods.toSafeJSON = function () {
  return {
    unlockedAchievements: this.unlockedAchievements || [],
    unlockedCount: (this.unlockedAchievements || []).length,
    totalAchievementXp: this.totalAchievementXp || 0,
    lastUpdatedAt: this.lastUpdatedAt,
  };
};

module.exports = mongoose.model('AchievementProgress', achievementProgressSchema);
