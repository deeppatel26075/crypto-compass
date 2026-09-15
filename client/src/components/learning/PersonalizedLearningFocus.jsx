import React from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import Skeleton from '../ui/Skeleton';

const CATEGORY_STYLES = {
  crypto_fundamentals: {
    color: '#00D4FF',
    badge: 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30',
  },
  market_basics: {
    color: '#F59E0B',
    badge: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
  },
  trading_fundamentals: {
    color: '#00F59B',
    badge: 'bg-[#00F59B]/10 text-[#00F59B] border-[#00F59B]/30',
  },
  risk_management: {
    color: '#EF4444',
    badge: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
  },
  trading_discipline: {
    color: '#A855F7',
    badge: 'bg-[#A855F7]/10 text-[#A855F7] border-[#A855F7]/30',
  },
};

/**
 * Phase 24: Personalized Learning Focus Component
 *
 * Displays the user's highest-priority deterministic learning recommendation.
 * Reuses existing recommendation reason without subjective/speculative claims.
 */
const PersonalizedLearningFocus = ({
  recommendation = null,
  learningState = null,
  loading = false,
  error = null,
  onRetry = null,
}) => {
  // 1. Loading State
  if (loading) {
    return (
      <div
        data-testid="personalized-focus-loading"
        className="p-6 rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] backdrop-blur-xl space-y-4 animate-pulse shadow-xl"
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-48 rounded bg-white/[0.05]" />
          <Skeleton className="h-5 w-24 rounded-full bg-white/[0.05]" />
        </div>
        <Skeleton className="h-7 w-64 rounded bg-white/[0.08]" />
        <Skeleton className="h-16 w-full rounded-xl bg-white/[0.04]" />
        <Skeleton className="h-10 w-36 rounded-xl bg-white/[0.06]" />
      </div>
    );
  }

  // 2. Error Fallback State
  if (error) {
    return (
      <div
        data-testid="personalized-focus-error"
        className="p-6 rounded-2xl bg-[#0a1420]/80 border border-rose-500/20 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-xl"
      >
        <div className="flex items-center gap-3 text-slate-300">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-white">Your learning path couldn't be loaded right now.</p>
            <p className="text-slate-400 text-[11px] mt-0.5">{error}</p>
          </div>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            data-testid="personalized-focus-retry-btn"
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-xs transition-colors flex items-center gap-2 border border-slate-700 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  // 3. Curriculum Complete State (all 15 lessons completed)
  const isComplete = learningState?.isCurriculumComplete && !recommendation;
  if (isComplete) {
    return (
      <div
        data-testid="personalized-focus-complete"
        className="p-6 sm:p-7 rounded-2xl bg-gradient-to-br from-[#0a1420]/90 to-[#0c1f17]/90 border border-[#00F59B]/20 backdrop-blur-xl shadow-xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#00F59B]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse" />
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F59B] uppercase">
                CURRICULUM COMPLETE
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              You've completed all 15 core lessons.
            </h2>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              You can review any lesson to reinforce core concepts or continue practicing in Scenario Mode and Paper Trading.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/scenarios"
              data-testid="complete-practice-btn"
              className="px-4 py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00F59B]/90 text-black font-bold text-xs transition-colors flex items-center gap-2 shadow-[0_0_15px_rgba(0,245,155,0.3)]"
            >
              <span>Practice Scenarios</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Empty / Brand New User State vs Normal Active Focus
  const isNewUser = (learningState?.completedLessons || 0) === 0 && recommendation?.type === 'FOUNDATIONS_REVIEW';
  const categoryStyle = CATEGORY_STYLES[recommendation?.category] || {
    color: '#00F59B',
    badge: 'bg-[#00F59B]/10 text-[#00F59B] border-[#00F59B]/30',
  };

  const headerTitle = isNewUser
    ? 'START YOUR LEARNING JOURNEY'
    : 'YOUR CURRENT LEARNING FOCUS';

  const priorityLabel = recommendation?.priority || 'HIGH';
  const priorityBadge =
    priorityLabel === 'HIGH'
      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
      : priorityLabel === 'MEDIUM'
      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
      : 'bg-slate-500/10 text-slate-300 border-slate-500/30';

  const targetLink = recommendation?.lessonId ? `/learn/${recommendation.lessonId}` : '/learn';

  return (
    <div
      data-testid="personalized-learning-focus"
      className="p-6 sm:p-7 rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] hover:border-[#00F59B]/30 backdrop-blur-xl shadow-xl transition-all relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          {/* Header Tagline & Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold tracking-wider text-[#00F59B] uppercase">
              <Compass className="w-3.5 h-3.5 text-[#00F59B]" />
              <span>{headerTitle}</span>
            </div>
            {recommendation?.categoryLabel && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${categoryStyle.badge}`}>
                {recommendation.categoryLabel}
              </span>
            )}
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${priorityBadge}`}>
              {priorityLabel} Priority
            </span>
          </div>

          {/* Topic Title */}
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            {recommendation?.title || 'Foundational Cryptocurrency'}
          </h2>

          {/* Educational "Why This?" Explanation (strictly derived from recommendation.reason) */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-[#00F59B] shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed font-sans">
              <span className="font-semibold text-white mr-1.5">Why this?</span>
              <span data-testid="focus-recommendation-reason">
                {recommendation?.reason || 'Based on your current progress, this lesson builds your foundational understanding.'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={targetLink}
            data-testid="focus-continue-btn"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#00F59B] hover:bg-[#00F59B]/90 text-black font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,245,155,0.3)] hover:shadow-[0_0_25px_rgba(0,245,155,0.5)]"
          >
            <span>{isNewUser ? 'Start Lesson' : 'Continue Learning'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedLearningFocus;
