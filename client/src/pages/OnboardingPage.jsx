import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  ArrowRight,
  ArrowLeft,
  Sprout,
  BookOpen,
  TrendingUp,
  Brain,
  BookMarked,
  Zap,
  BarChart3,
  ShieldCheck,
  Target,
  Clock,
  Gamepad2,
  HelpCircle,
  Laptop,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import OnboardingProgress from '../components/onboarding/OnboardingProgress';
import OnboardingOptionCard from '../components/onboarding/OnboardingOptionCard';

// Step 1 Options
const EXPERIENCE_OPTIONS = [
  {
    id: 'beginner',
    title: 'Complete Beginner',
    description: "I'm new to crypto and want to understand the fundamentals.",
    icon: Sprout,
  },
  {
    id: 'curious',
    title: 'Curious Learner',
    description: 'I understand the basics but want to learn more.',
    icon: BookOpen,
  },
  {
    id: 'practice_trader',
    title: 'Practice Trader',
    description: "I've explored paper trading and want to improve.",
    icon: TrendingUp,
  },
  {
    id: 'experienced',
    title: 'Experienced Trader',
    description: 'I already understand trading and want to sharpen my skills.',
    icon: Brain,
  },
];

// Step 2 Options
const GOAL_OPTIONS = [
  {
    id: 'crypto_fundamentals',
    title: 'Learn Crypto Fundamentals',
    description: 'Master blockchain fundamentals, tokenomics, and market structures.',
    icon: BookMarked,
  },
  {
    id: 'practice_trading',
    title: 'Practice Trading',
    description: 'Simulate trades in real time using virtual risk-free capital.',
    icon: Zap,
  },
  {
    id: 'technical_analysis',
    title: 'Understand Technical Analysis',
    description: 'Read candlestick trends, support/resistance, and volume indicators.',
    icon: BarChart3,
  },
  {
    id: 'risk_management',
    title: 'Improve Risk Management',
    description: 'Protect capital with position sizing and systematic stop-losses.',
    icon: ShieldCheck,
  },
  {
    id: 'trading_discipline',
    title: 'Build Better Trading Discipline',
    description: 'Master trading psychology, manage emotions, and follow rules.',
    icon: Target,
  },
];

// Step 3 Options
const LEARNING_STYLE_OPTIONS = [
  {
    id: 'short_lessons',
    title: 'Short Lessons',
    description: 'Quick concepts that are easy to finish in 5-10 minutes.',
    icon: Clock,
  },
  {
    id: 'scenarios',
    title: 'Interactive Scenarios',
    description: 'Learn by making decisions in realistic market situations.',
    icon: Gamepad2,
  },
  {
    id: 'quizzes',
    title: 'Quizzes',
    description: 'Test yourself with targeted questions and learn from explanations.',
    icon: HelpCircle,
  },
  {
    id: 'practice',
    title: 'Practice',
    description: 'Learn by doing with interactive simulated paper execution.',
    icon: Laptop,
  },
];

export default function OnboardingPage() {
  const { user, completeOnboarding } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [experienceLevel, setExperienceLevel] = useState(null);
  const [primaryGoal, setPrimaryGoal] = useState(null);
  const [learningStyle, setLearningStyle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [validationNotice, setValidationNotice] = useState(null);

  // Clear validation warning when an option is picked
  const handleSelectExperience = (id) => {
    setExperienceLevel(id);
    setValidationNotice(null);
  };

  const handleSelectGoal = (id) => {
    setPrimaryGoal(id);
    setValidationNotice(null);
  };

  const handleSelectStyle = (id) => {
    setLearningStyle(id);
    setValidationNotice(null);
  };

  // Step advancement with validation
  const handleNext = () => {
    setValidationNotice(null);
    if (step === 1 && !experienceLevel) {
      setValidationNotice('Please choose an option to continue.');
      return;
    }
    if (step === 2 && !primaryGoal) {
      setValidationNotice('Please choose an option to continue.');
      return;
    }
    if (step === 3 && !learningStyle) {
      setValidationNotice('Please choose an option to continue.');
      return;
    }
    setStep((prev) => Math.min(4, prev + 1));
  };

  const handleBack = () => {
    setValidationNotice(null);
    setError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  // Final submission on Step 4
  const handleSubmit = async () => {
    if (!experienceLevel || !primaryGoal || !learningStyle) {
      setError('Please complete all onboarding steps before continuing.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await completeOnboarding({
        experienceLevel,
        primaryGoal,
        learningStyle,
      });
      // Brief delay so the user clearly perceives the loading state transition
      await new Promise((resolve) => setTimeout(resolve, 400));
      // Route smoothly to dashboard upon completion
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(
        err.message || 'Something went wrong while saving your preferences. Please try again.'
      );
      setLoading(false);
    }
  };

  // Find labels for review summary
  const selectedExpObj = EXPERIENCE_OPTIONS.find((o) => o.id === experienceLevel);
  const selectedGoalObj = GOAL_OPTIONS.find((o) => o.id === primaryGoal);
  const selectedStyleObj = LEARNING_STYLE_OPTIONS.find((o) => o.id === learningStyle);

  return (
    <div className="min-h-screen bg-[#020609] flex flex-col justify-between py-10 sm:py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans text-gray-200">
      {/* Calm ambient background lighting (no heavy Three.js scene) */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#00F59B]/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-[#8A2BE2]/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-xl mx-auto relative z-10 flex-1 flex flex-col justify-center">
        {/* Brand Header */}
        <div className="text-center mb-6 select-none">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#0a1420] border border-[#00F59B]/30 mb-4 shadow-[0_0_15px_rgba(0,245,155,0.15)]">
            <Compass className="w-4 h-4 text-[#00F59B]" />
            <span className="text-xs font-bold tracking-tight text-white font-sans">
              Crypto <span className="text-[#00F59B]">Compass</span>
            </span>
          </div>

          <OnboardingProgress currentStep={step} totalSteps={4} />
        </div>

        {/* Validation Alert */}
        {validationNotice && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 rounded-xl bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center gap-2.5 text-xs text-[#00F59B] font-medium"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{validationNotice}</span>
          </motion.div>
        )}

        {/* Submission Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center gap-2.5 text-xs text-[#FCA5A5] font-medium"
          >
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-[#EF4444]" />
            <span>{error}</span>
          </motion.div>
        )}

        {/* Dynamic Step Content */}
        <AnimatePresence mode="wait">
          {/* STEP 1: EXPERIENCE */}
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                  Where are you on your crypto journey?
                </h1>
                <p className="mt-2 text-sm text-gray-400 font-sans leading-relaxed">
                  Tell us where you're starting from. There are no wrong answers.
                </p>
              </div>

              <div className="space-y-3" role="radiogroup" aria-label="Crypto Experience Level">
                {EXPERIENCE_OPTIONS.map((opt) => (
                  <OnboardingOptionCard
                    key={opt.id}
                    id={opt.id}
                    title={opt.title}
                    description={opt.description}
                    icon={opt.icon}
                    isSelected={experienceLevel === opt.id}
                    onSelect={handleSelectExperience}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 2: GOAL */}
          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                  What do you want to achieve?
                </h1>
                <p className="mt-2 text-sm text-gray-400 font-sans leading-relaxed">
                  Choose what matters most to you right now.
                </p>
              </div>

              <div className="space-y-3" role="radiogroup" aria-label="Primary Goal">
                {GOAL_OPTIONS.map((opt) => (
                  <OnboardingOptionCard
                    key={opt.id}
                    id={opt.id}
                    title={opt.title}
                    description={opt.description}
                    icon={opt.icon}
                    isSelected={primaryGoal === opt.id}
                    onSelect={handleSelectGoal}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 3: LEARNING STYLE */}
          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                  How do you learn best?
                </h1>
                <p className="mt-2 text-sm text-gray-400 font-sans leading-relaxed">
                  We'll use this preference to shape your learning experience.
                </p>
              </div>

              <div className="space-y-3" role="radiogroup" aria-label="Preferred Learning Style">
                {LEARNING_STYLE_OPTIONS.map((opt) => (
                  <OnboardingOptionCard
                    key={opt.id}
                    id={opt.id}
                    title={opt.title}
                    description={opt.description}
                    icon={opt.icon}
                    isSelected={learningStyle === opt.id}
                    onSelect={handleSelectStyle}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* STEP 4: REVIEW & CONFIRM */}
          {step === 4 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B] text-xs font-mono mb-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Personalized Roadmap</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
                  Your Crypto Compass is ready.
                </h1>
                <p className="mt-2 text-sm text-gray-400 font-sans leading-relaxed">
                  Review your selections below. You can change your preferences later from your
                  profile.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="space-y-3 bg-[#08111a]/85 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/[0.1] shadow-2xl">
                {/* Experience Row */}
                <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B]">
                      {selectedExpObj?.icon ? (
                        <selectedExpObj.icon className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                        Experience
                      </div>
                      <div className="text-sm font-bold text-white font-sans">
                        {selectedExpObj?.title || 'Not Selected'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs font-semibold text-[#00F59B] hover:text-[#00F59B]/80 hover:underline px-2 py-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#00F59B]"
                  >
                    Edit
                  </button>
                </div>

                {/* Goal Row */}
                <div className="flex items-center justify-between py-3 border-b border-white/[0.06] last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B]">
                      {selectedGoalObj?.icon ? (
                        <selectedGoalObj.icon className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                        Primary Goal
                      </div>
                      <div className="text-sm font-bold text-white font-sans">
                        {selectedGoalObj?.title || 'Not Selected'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="text-xs font-semibold text-[#00F59B] hover:text-[#00F59B]/80 hover:underline px-2 py-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#00F59B]"
                  >
                    Edit
                  </button>
                </div>

                {/* Learning Style Row */}
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B]">
                      {selectedStyleObj?.icon ? (
                        <selectedStyleObj.icon className="w-4 h-4" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="text-[11px] font-mono text-gray-400 uppercase tracking-wider">
                        Learning Style
                      </div>
                      <div className="text-sm font-bold text-white font-sans">
                        {selectedStyleObj?.title || 'Not Selected'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="text-xs font-semibold text-[#00F59B] hover:text-[#00F59B]/80 hover:underline px-2 py-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#00F59B]"
                  >
                    Edit
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Actions */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between gap-4">
          {step > 1 ? (
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={handleBack}
              disabled={loading}
              className="px-4 py-2.5 text-xs sm:text-sm font-bold"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back</span>
            </Button>
          ) : (
            <div /> // Spacer
          )}

          {step < 4 ? (
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={handleNext}
              className="ml-auto px-6 py-2.5 text-xs sm:text-sm font-extrabold uppercase tracking-wider"
            >
              <span>Continue →</span>
            </Button>
          ) : (
            <Button
              type="button"
              variant="primary"
              size="lg"
              onClick={handleSubmit}
              isLoading={loading}
              loadingText="BUILDING YOUR PATH..."
              disabled={loading}
              className="ml-auto px-6 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider shadow-[0_0_30px_rgba(0,245,155,0.4)]"
            >
              <span>BUILD MY LEARNING PATH →</span>
            </Button>
          )}
        </div>
      </div>

      {/* Footer Safety Notice */}
      <div className="mt-8 text-center relative z-10">
        <p className="text-[11px] font-mono text-gray-500">
          Crypto Compass · Educational Simulation Only · No Real Money
        </p>
      </div>
    </div>
  );
}
