import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  RefreshCw,
  Award,
  Layers,
  HelpCircle,
  Sparkles,
  Compass,
} from 'lucide-react';
import { getLesson, getProgress, completeLesson } from '../services/learningService';
import Skeleton from '../components/ui/Skeleton';

const LESSON_SCENARIO_MAP = {
  'how-blockchain-works': 'scenario-blockchain-verification',
  'crypto-wallets-explained': 'scenario-wallet-seed-phrase-security',
  'market-capitalization-explained': 'scenario-evaluating-market-cap-vs-unit-price',
  'volatility-explained': 'scenario-navigating-high-volatility',
  'market-orders-explained': 'scenario-market-order-slippage',
  'understanding-trading-volume': 'scenario-interpreting-trading-volume',
  'position-sizing-basics': 'scenario-position-sizing-discipline',
  'what-is-risk-management': 'scenario-defining-downside-risk',
  'trading-with-a-plan': 'scenario-sticking-to-a-trade-plan',
  'common-beginner-mistakes': 'scenario-avoiding-fomo-impulses',
};

const CATEGORY_COLORS = {
  crypto_fundamentals: {
    badge: 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30',
    bar: '#00D4FF',
  },
  market_basics: {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    bar: '#F59E0B',
  },
  trading_fundamentals: {
    badge: 'bg-[#00F59B]/10 text-[#00F59B] border-[#00F59B]/30',
    bar: '#00F59B',
  },
  risk_management: {
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    bar: '#EF4444',
  },
  trading_discipline: {
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    bar: '#A855F7',
  },
};

const LessonPage = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [error, setError] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const fetchLessonData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setNotFound(false);

      const [lessonRes, progressRes] = await Promise.all([
        getLesson(lessonId),
        getProgress().catch(() => ({ data: { completedLessons: [] } })),
      ]);

      if (lessonRes && lessonRes.data) {
        setLesson(lessonRes.data);
      } else {
        throw new Error('Lesson not found');
      }

      if (progressRes && progressRes.data && progressRes.data.completedLessons) {
        setIsCompleted(progressRes.data.completedLessons.includes(lessonId));
      }
    } catch (err) {
      if (err.message && (err.message.includes('not found') || err.message.includes('404'))) {
        setNotFound(true);
      } else {
        setError(err.message || 'Failed to load lesson.');
      }
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    fetchLessonData();
    setCurrentSectionIndex(0);
  }, [fetchLessonData]);

  const handleComplete = async () => {
    if (completing) return;
    try {
      setCompleting(true);
      const res = await completeLesson(lessonId);
      if (res && res.data) {
        setIsCompleted(true);
      }
    } catch (err) {
      console.error('Failed to complete lesson:', err);
    } finally {
      setCompleting(false);
    }
  };

  // 404 State
  if (notFound) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center" data-testid="lesson-not-found">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <BookOpen className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 font-display">Lesson Not Found</h1>
        <p className="text-slate-400 mb-6 text-sm max-w-md mx-auto">
          The requested lesson could not be found. It may have been moved or does not exist.
        </p>
        <Link
          to="/learn"
          data-testid="not-found-back-link"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white text-sm font-medium border border-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Learn Catalog
        </Link>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-white mb-1">Failed to Load Lesson</h2>
          <p className="text-sm text-slate-300 mb-4">{error}</p>
          <button
            onClick={fetchLessonData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-medium border border-white/15 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Loading Skeleton
  if (loading || !lesson) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-pulse py-4">
        <div className="h-6 w-32 bg-white/10 rounded" />
        <div className="space-y-3">
          <div className="h-8 w-3/4 bg-white/10 rounded" />
          <div className="h-4 w-1/2 bg-white/5 rounded" />
        </div>
        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
          <div className="h-5 w-48 bg-white/10 rounded" />
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-5/6 bg-white/5 rounded" />
        </div>
        <div className="p-8 rounded-2xl bg-white/[0.03] border border-white/5 space-y-4">
          <div className="h-6 w-56 bg-white/10 rounded" />
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-full bg-white/5 rounded" />
          <div className="h-4 w-3/4 bg-white/5 rounded" />
        </div>
      </div>
    );
  }

  const categoryStyle = CATEGORY_COLORS[lesson.category] || {
    badge: 'bg-white/10 text-slate-300 border-white/20',
    bar: '#00D4FF',
  };

  const sections = lesson.sections || [];
  const currentSection = sections[currentSectionIndex] || sections[0] || {};
  const totalSections = sections.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back Link */}
      <div>
        <Link
          to="/learn"
          data-testid="back-to-learn-link"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>Back to Learn</span>
        </Link>
      </div>

      {/* Lesson Header */}
      <div
        className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden"
        data-testid="lesson-header"
      >
        {/* Subtle Category Accent Glow */}
        <div
          className="absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ backgroundColor: categoryStyle.bar }}
        />

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryStyle.badge}`}
          >
            {lesson.categoryLabel || lesson.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/[0.06] text-slate-300 border border-white/[0.08]">
            {lesson.difficulty || 'BEGINNER'}
          </span>
          <div className="flex items-center gap-1 text-xs text-slate-400 ml-auto">
            <Clock className="w-3.5 h-3.5" />
            <span>{lesson.estimatedMinutes} min read</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-display mb-3 tracking-tight">
          {lesson.title}
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
          {lesson.description}
        </p>

        {/* Completion status pill */}
        {isCompleted && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/30 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Lesson Completed</span>
          </div>
        )}
      </div>

      {/* Objectives Card ("What You'll Learn") */}
      {lesson.objectives && lesson.objectives.length > 0 && (
        <div
          className="p-6 rounded-2xl bg-slate-900/40 border border-white/[0.06]"
          data-testid="lesson-objectives"
        >
          <h2 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2 mb-4">
            <BookOpen className="w-4 h-4 text-[#00D4FF]" />
            What You'll Learn
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lesson.objectives.map((obj, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-white/[0.06] text-slate-400 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{obj}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Multi-Section Reader */}
      {totalSections > 0 && (
        <div
          className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-white/[0.08] backdrop-blur-xl"
          data-testid="section-reader"
        >
          {/* Section Progress & Header */}
          <div className="flex items-center justify-between gap-4 pb-4 mb-6 border-b border-white/[0.06]">
            <div>
              <span className="text-xs font-medium text-slate-400" data-testid="section-step-indicator">
                Section {currentSectionIndex + 1} of {totalSections}
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-white mt-1" data-testid="section-title">
                {currentSection.title}
              </h3>
            </div>
            {/* Section indicator pills */}
            <div className="flex items-center gap-1.5">
              {sections.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSectionIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === currentSectionIndex
                      ? 'w-6 bg-[#00D4FF]'
                      : 'w-2 bg-white/20 hover:bg-white/40'
                  }`}
                  aria-label={`Go to section ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Section Content */}
          <div className="text-slate-200 text-sm sm:text-base leading-relaxed space-y-4 mb-8" data-testid="section-content">
            <p>{currentSection.content}</p>
          </div>

          {/* Section Pagination Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <button
              onClick={() => setCurrentSectionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentSectionIndex === 0}
              data-testid="prev-section-btn"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-colors ${
                currentSectionIndex === 0
                  ? 'opacity-40 cursor-not-allowed border-white/5 text-slate-500'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] text-white border-white/10'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous Section
            </button>

            {currentSectionIndex < totalSections - 1 ? (
              <button
                onClick={() =>
                  setCurrentSectionIndex((prev) => Math.min(totalSections - 1, prev + 1))
                }
                data-testid="next-section-btn"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-[#00D4FF]/15 hover:bg-[#00D4FF]/25 text-[#00D4FF] border border-[#00D4FF]/30 transition-colors"
              >
                Next Section
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <span className="text-xs text-slate-500 font-medium">End of sections</span>
            )}
          </div>
        </div>
      )}

      {/* Key Takeaways Card */}
      {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
        <div
          className="p-6 rounded-2xl bg-slate-900/40 border border-white/[0.06]"
          data-testid="key-takeaways"
        >
          <h2 className="text-sm font-semibold text-white tracking-wider uppercase flex items-center gap-2 mb-4">
            <Award className="w-4 h-4 text-[#00F59B]" />
            Key Takeaways
          </h2>
          <ul className="space-y-2.5">
            {lesson.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-[#00F59B] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Mark Complete Action Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white mb-1">
            {isCompleted ? 'Lesson Completed!' : 'Finished this lesson?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400">
            {isCompleted
              ? 'Great work! You have marked this lesson as complete in your learning progress.'
              : 'Mark it complete to record your learning progress across the curriculum.'}
          </p>
        </div>

        <button
          onClick={handleComplete}
          disabled={completing}
          data-testid="complete-lesson-btn"
          className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 ${
            isCompleted
              ? 'bg-[#00F59B]/15 text-[#00F59B] border border-[#00F59B]/30 hover:bg-[#00F59B]/20'
              : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20 active:scale-98'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {completing
            ? 'Updating...'
            : isCompleted
            ? 'Completed (Click to Re-verify)'
            : 'Mark Lesson Complete'}
        </button>
      </div>

      {/* Test Your Understanding Quiz Card */}
      <div
        className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-indigo-950/20 to-slate-900/60 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        data-testid="take-quiz-card"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            Test Your Understanding
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Reinforce what you learned with a 5-question conceptual assessment. Pass with 80% or higher
            to earn 100 Learning XP.
          </p>
        </div>
        <Link
          to={`/quiz/quiz-${lessonId}`}
          data-testid="take-quiz-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-purple-500/20 transition-colors shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>Take Quiz</span>
        </Link>
      </div>

      {/* Apply What You Learned Scenario Card */}
      <div
        className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-slate-900/60 border border-[#00F59B]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        data-testid="apply-scenario-card"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00F59B] uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            Apply What You Learned
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Practice this concept in an educational scenario. Test decision-making in realistic educational situations with zero financial risk.
          </p>
        </div>
        <Link
          to={LESSON_SCENARIO_MAP[lessonId] ? `/scenarios/${LESSON_SCENARIO_MAP[lessonId]}` : '/scenarios'}
          data-testid="try-scenario-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F59B] hover:bg-[#00F59B]/90 text-black text-xs sm:text-sm font-bold shadow-lg shadow-[#00F59B]/20 transition-colors shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Try Scenario</span>
        </Link>
      </div>

      {/* Practice in Simulated Markets Call-to-Action */}
      <div
        className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 via-cyan-950/20 to-slate-900/60 border border-[#00D4FF]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        data-testid="practice-card"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00D4FF] uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" />
            Ready to Practice?
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Put these concepts to work in simulated paper trading using your virtual funds. Practice
            orders, explore market depth, and test strategies with zero real capital risk.
          </p>
        </div>
        <Link
          to="/markets"
          data-testid="explore-markets-link"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-slate-950 text-xs sm:text-sm font-bold shadow-lg shadow-[#00D4FF]/20 transition-colors shrink-0"
        >
          <span>Explore Markets</span>
          <ArrowLeft className="w-4 h-4 rotate-180" />
        </Link>
      </div>
    </div>
  );
};

export default LessonPage;
