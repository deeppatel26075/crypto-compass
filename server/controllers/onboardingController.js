const ALLOWED_EXPERIENCE = [
  'beginner',
  'curious',
  'practice_trader',
  'experienced',
];

const ALLOWED_GOALS = [
  'crypto_fundamentals',
  'practice_trading',
  'technical_analysis',
  'risk_management',
  'trading_discipline',
];

const ALLOWED_STYLES = [
  'short_lessons',
  'scenarios',
  'quizzes',
  'practice',
];

/**
 * Complete user onboarding and persist personalization preferences
 * PUT /api/onboarding
 */
const completeOnboarding = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
    }

    const { experienceLevel, primaryGoal, learningStyle } = req.body || {};

    // Validate presence and enum bounds
    if (
      !experienceLevel ||
      !ALLOWED_EXPERIENCE.includes(experienceLevel) ||
      !primaryGoal ||
      !ALLOWED_GOALS.includes(primaryGoal) ||
      !learningStyle ||
      !ALLOWED_STYLES.includes(learningStyle)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid onboarding selection.',
      });
    }

    // Update user document
    user.onboarding = {
      completed: true,
      experienceLevel,
      primaryGoal,
      learningStyle,
      completedAt: new Date(),
    };

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Onboarding completed successfully.',
      user: user.toSafeJSON(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  completeOnboarding,
  ALLOWED_EXPERIENCE,
  ALLOWED_GOALS,
  ALLOWED_STYLES,
};
