const mongoose = require('mongoose');

const scenarioResultItemSchema = new mongoose.Schema(
  {
    scenarioId: {
      type: String,
      required: true,
      trim: true,
    },
    selectedOptionId: {
      type: String,
      required: true,
      trim: true,
    },
    educationalQuality: {
      type: String,
      required: true,
      enum: ['STRONG', 'REASONABLE', 'RISKY', 'UNHELPFUL'],
    },
    completedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const scenarioProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required for scenario progress.'],
      unique: true,
      index: true,
    },
    completedScenarios: [
      {
        type: String,
        trim: true,
      },
    ],
    scenarioResults: [scenarioResultItemSchema],
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
 * Returns sanitized client-safe scenario progress
 */
scenarioProgressSchema.methods.toSafeJSON = function () {
  return {
    completedScenarios: this.completedScenarios || [],
    completedCount: (this.completedScenarios || []).length,
    scenarioResults: this.scenarioResults || [],
    lastCompletedAt: this.lastCompletedAt,
  };
};

module.exports = mongoose.model('ScenarioProgress', scenarioProgressSchema);
