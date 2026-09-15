import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Layers,
  Sparkles,
  HelpCircle,
  Compass,
  X,
} from 'lucide-react';
import { getCatalog, getProgress, getRecommendations } from '../services/learningService';
import { getQuizProgress } from '../services/quizService';
import Skeleton from '../components/ui/Skeleton';
import PersonalizedLearningFocus from '../components/learning/PersonalizedLearningFocus';
import LearningProgressSummary from '../components/learning/LearningProgressSummary';

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

const CATEGORY_TABS = [
  { id: 'all', label: 'All Lessons' },
  { id: 'crypto_fundamentals', label: 'Crypto Fundamentals' },
  { id: 'market_basics', label: 'Market Basics' },
  { id: 'trading_fundamentals', label: 'Trading Fundamentals' },
  { id: 'risk_management', label: 'Risk Management' },
  { id: 'trading_discipline', label: 'Trading Discipline' },
];

const CATEGORY_COLORS = {
  crypto_fundamentals: '#00D4FF', // Cyan
  market_basics: '#F59E0B', // Amber
  trading_fundamentals: '#00F59B', // Emerald / Neon Green
  risk_management: '#EF4444', // Red / Rose
  trading_discipline: '#A855F7', // Purple
};

const LearnPage = () => {
  const [lessons, setLessons] = useState([]);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [quizProgress, setQuizProgress] = useState({ completedQuizzes: [], totalXp: 0 });
  const [recommendations, setRecommendations] = useState([]);
  const [learningState, setLearningState] = useState(null);
  const [recommendationsLoading, setRecommendationsLoading] = useState(true);
  const [recommendationsError, setRecommendationsError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecommendationsData = useCallback(async () => {
    try {
      setRecommendationsLoading(true);
      setRecommendationsError(null);
      const recRes = await getRecommendations();
      if (recRes && recRes.data) {
        setRecommendations(recRes.data.recommendations || []);
        setLearningState(recRes.data.learningState || null);
      }
    } catch (err) {
      setRecommendationsError('Unable to load your recommendations right now.');
    } finally {
      setRecommendationsLoading(false);
    }
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [catalogRes, progressRes, quizProgRes] = await Promise.all([
        getCatalog(),
        getProgress().catch(() => ({ data: { completedLessons: [] } })),
        getQuizProgress().catch(() => ({ data: { completedQuizzes: [], totalXp: 0 } })),
      ]);

      if (catalogRes && catalogRes.data) {
        setLessons(catalogRes.data.lessons || []);
        setError(null);
      } else {
        throw new Error('No lesson data returned from server.');
      }

      if (progressRes && progressRes.data) {
        setCompletedLessons(progressRes.data.completedLessons || []);
      }

      if (quizProgRes && quizProgRes.data) {
        setQuizProgress(quizProgRes.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to load learning content.');
    } finally {
      setLoading(false);
    }

    // Concurrently fetch recommendations without blocking catalog rendering
    fetchRecommendationsData();
  }, [fetchRecommendationsData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Client-side search and category filtering
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => {
      const matchesCat =
        selectedCategory === 'all' || lesson.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        lesson.title.toLowerCase().includes(q) ||
        lesson.description.toLowerCase().includes(q) ||
        lesson.categoryLabel.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [lessons, selectedCategory, searchQuery]);

  const completedSet = useMemo(() => new Set(completedLessons), [completedLessons]);
  const completedCount = completedSet.size;
  const totalCount = lessons.length || 15;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true" aria-live="polite">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div className="space-y-2">
            <Skeleton className="h-8 w-44 rounded-lg bg-white/[0.05]" />
            <Skeleton className="h-4 w-72 rounded bg-white/[0.03]" />
          </div>
          <Skeleton className="h-10 w-64 rounded-full bg-white/[0.05]" />
        </div>

        {/* Progress Card Skeleton */}
        <div className="p-5 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] space-y-3">
          <Skeleton className="h-4 w-48 rounded bg-white/[0.05]" />
          <Skeleton className="h-3 w-full rounded-full bg-white/[0.04]" />
        </div>

        {/* Filters Skeleton */}
        <div className="flex gap-2 overflow-x-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-xl bg-white/[0.04]" />
          ))}
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] space-y-3">
              <Skeleton className="h-4 w-24 rounded bg-white/[0.05]" />
              <Skeleton className="h-6 w-48 rounded bg-white/[0.06]" />
              <Skeleton className="h-12 w-full rounded bg-white/[0.03]" />
              <Skeleton className="h-8 w-28 rounded-xl bg-white/[0.05]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State View
  if (error) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] mb-4 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Unable to load learning content.</h2>
        <p className="text-sm text-gray-400 max-w-md mb-6">
          {error || 'A temporary communication error occurred while loading the curriculum.'}
        </p>
        <button
          onClick={fetchData}
          className="px-5 py-2.5 rounded-xl bg-[#00F59B] text-black font-semibold text-xs hover:bg-[#00F59B]/90 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12" data-testid="learn-container">
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase font-sans flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#00F59B]" />
              <span>Learn</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B]">
              Academy
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Build your crypto knowledge · Learn the concepts before you practice them
          </p>
        </div>

        {/* Search Input */}
        <div className="w-full md:w-72 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons..."
            aria-label="Search lessons"
            data-testid="search-input"
            className="w-full bg-[#0a1118] text-gray-200 text-xs rounded-full pl-9 pr-4 py-2 border border-white/[0.09] hover:border-white/[0.18] focus:border-[#00F59B] focus:ring-1 focus:ring-[#00F59B]/30 outline-none transition-all placeholder-gray-500 font-sans"
          />
        </div>
      </div>

      {/* 2. Phase 24: Personalized Learning Focus */}
      <PersonalizedLearningFocus
        recommendation={recommendations[0] || null}
        learningState={learningState}
        loading={recommendationsLoading}
        error={recommendationsError}
        onRetry={fetchRecommendationsData}
      />

      {/* 3. Phase 24: Personalized Learning Progress Summary */}
      <LearningProgressSummary
        learningState={learningState}
        activeFocus={recommendations[0] || null}
        loading={recommendationsLoading}
      />

      {/* 4. Phase 24: Continue Learning Section (Up to 3 recommendations) */}
      <section className="space-y-3" aria-labelledby="continue-learning-heading" data-testid="continue-learning-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#00F59B]" />
            <h2 id="continue-learning-heading" className="text-xs font-bold text-white uppercase tracking-wider">
              Continue Learning
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B]">
              Personalized
            </span>
          </div>
          <p className="text-[11px] text-gray-400 hidden sm:block">
            Top educational recommendations based on your activity
          </p>
        </div>

        {/* Loading State */}
        {recommendationsLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="recommendations-loading">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-5 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] space-y-3">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24 rounded bg-white/[0.05]" />
                  <Skeleton className="h-4 w-16 rounded bg-white/[0.05]" />
                </div>
                <Skeleton className="h-5 w-44 rounded bg-white/[0.06]" />
                <Skeleton className="h-10 w-full rounded bg-white/[0.03]" />
                <Skeleton className="h-12 w-full rounded-xl bg-white/[0.04]" />
                <Skeleton className="h-8 w-28 rounded-xl bg-white/[0.05]" />
              </div>
            ))}
          </div>
        )}

        {/* Error Fallback (non-blocking) */}
        {!recommendationsLoading && recommendationsError && (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between gap-4 text-xs text-gray-400" data-testid="recommendations-error">
            <div className="flex items-center gap-2 text-gray-300">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{recommendationsError}</span>
            </div>
            <button
              onClick={fetchRecommendationsData}
              className="px-3 py-1 rounded-lg bg-white/[0.05] hover:bg-white/10 text-white font-medium text-[11px] transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Completed / Up to Date State */}
        {!recommendationsLoading && !recommendationsError && recommendations.length === 0 && (
          <div
            className="p-6 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] backdrop-blur-xl text-center space-y-2"
            data-testid="recommendations-up-to-date"
          >
            <div className="w-10 h-10 rounded-xl bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Your learning path is up to date</h3>
            <p className="text-xs text-gray-400 max-w-md mx-auto">
              {learningState?.isCurriculumComplete
                ? 'Your core learning curriculum is complete. Continue practicing in Paper Trading or explore Scenario Mode.'
                : 'No immediate review items detected. Explore any lesson below to continue expanding your crypto knowledge.'}
            </p>
          </div>
        )}

        {/* Recommendations Cards Grid (Up to 3 cards) */}
        {!recommendationsLoading && !recommendationsError && recommendations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="recommendations-grid">
            {recommendations.slice(0, 3).map((rec) => {
              const isHigh = rec.priority === 'HIGH';
              const isMedium = rec.priority === 'MEDIUM';

              const priorityClasses = isHigh
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : isMedium
                ? 'bg-[#00F59B]/10 text-[#00F59B] border-[#00F59B]/30'
                : 'bg-slate-500/10 text-slate-300 border-slate-500/30';

              const typeLabels = {
                FOUNDATIONS_REVIEW: 'Foundations',
                NEXT_LESSON: 'Next Lesson',
                QUIZ_REVIEW: 'Quiz Review',
                SCENARIO_REVIEW: 'Scenario Practice',
                BEHAVIOR_REVIEW: 'Behavior Review',
              };

              return (
                <div
                  key={rec.id}
                  data-testid={`recommendation-card-${rec.id}`}
                  className="p-5 rounded-2xl bg-[#0a1118]/90 border border-white/[0.09] hover:border-[#00F59B]/40 backdrop-blur-xl flex flex-col justify-between transition-all group shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/[0.05] text-gray-300 border border-white/10">
                        {typeLabels[rec.type] || rec.type}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${priorityClasses}`}>
                        {rec.priority} Priority
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold text-white group-hover:text-[#00F59B] transition-colors mb-2">
                      {rec.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-3">
                      {rec.description}
                    </p>

                    {/* Why this is recommended */}
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] mb-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                        <Sparkles className="w-3 h-3 text-[#00F59B]" />
                        <span>Why This Is Recommended</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed font-sans">
                        {rec.reason}
                      </p>
                    </div>
                  </div>

                  {/* Action CTAs */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-end gap-2">
                    {/* Quiz CTA if applicable */}
                    {rec.quizId && (rec.type === 'QUIZ_REVIEW' || rec.type === 'BEHAVIOR_REVIEW') && (
                      <Link
                        to={`/quiz/${rec.quizId}`}
                        data-testid={`rec-quiz-link-${rec.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/10 transition-colors"
                        title="Retake the assessment quiz"
                      >
                        <HelpCircle className="w-3 h-3 text-[#00D4FF]" />
                        <span>Retake Quiz</span>
                      </Link>
                    )}

                    {/* Scenario CTA if applicable */}
                    {rec.scenarioId && (rec.type === 'SCENARIO_REVIEW' || rec.type === 'BEHAVIOR_REVIEW') && (
                      <Link
                        to={`/scenarios/${rec.scenarioId}`}
                        data-testid={`rec-scenario-link-${rec.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/10 transition-colors"
                        title="Practice this concept in a scenario"
                      >
                        <Compass className="w-3 h-3 text-[#00F59B]" />
                        <span>Practice</span>
                      </Link>
                    )}

                    {/* Lesson CTA */}
                    <Link
                      to={`/learn/${rec.lessonId}`}
                      data-testid={`rec-lesson-link-${rec.id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#00F59B] text-black hover:bg-[#00F59B]/90 shadow-[0_0_15px_rgba(0,245,155,0.2)] transition-all"
                    >
                      <span>
                        {rec.type === 'FOUNDATIONS_REVIEW'
                          ? 'Start Learning'
                          : rec.type === 'NEXT_LESSON'
                          ? 'Start Lesson'
                          : 'Review Lesson'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search lessons by title, topic, or concept (e.g. Blockchain, Risk, Wallets)..."
          data-testid="learn-search-input"
          className="w-full pl-11 pr-10 py-2.5 rounded-xl bg-[#0a1420]/80 border border-white/[0.08] hover:border-white/[0.18] focus:border-[#00F59B] focus:ring-1 focus:ring-[#00F59B]/30 text-xs text-gray-200 placeholder-gray-500 outline-none transition-all font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 text-xs"
            title="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 3. Category Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none" data-testid="category-filters">
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#0f1722] text-white border border-white/10 shadow-sm ring-1 ring-[#00F59B]/30'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.03]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* 4. Lesson Cards Grid */}
      {filteredLessons.length === 0 ? (
        <div
          className="p-12 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] text-center backdrop-blur-xl space-y-3"
          data-testid="no-lessons-found"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-400 mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No lessons found</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            No lessons match "{searchQuery}". Try adjusting your keywords or clearing the category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-gray-200 text-xs font-semibold transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="lessons-grid">
          {filteredLessons.map((lesson) => {
            const isCompleted = completedSet.has(lesson.id);
            const catColor = CATEGORY_COLORS[lesson.category] || '#00D4FF';

            return (
              <div
                key={lesson.id}
                data-testid={`lesson-card-${lesson.id}`}
                className="p-5 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] hover:border-white/[0.18] backdrop-blur-xl flex flex-col justify-between transition-all group"
              >
                <div>
                  {/* Top metadata tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${catColor}15`,
                        color: catColor,
                        border: `1px solid ${catColor}30`,
                      }}
                    >
                      {lesson.categoryLabel}
                    </span>

                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                      <span>{lesson.difficulty}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.estimatedMinutes} min
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-[#00F59B] transition-colors mb-2">
                    {lesson.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-4">
                    {lesson.description}
                  </p>
                </div>

                {/* Footer: Completion status and CTAs */}
                <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#00F59B]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500 font-medium">
                        Not Started
                      </span>
                    )}

                    {/* Quiz status indicator */}
                    {quizProgress.completedQuizzes.includes(`quiz-${lesson.id}`) && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/20 text-[10px] font-semibold">
                        <Sparkles className="w-2.5 h-2.5" />
                        Quiz Passed
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {LESSON_SCENARIO_MAP[lesson.id] ? (
                      <Link
                        to={`/scenarios/${LESSON_SCENARIO_MAP[lesson.id]}`}
                        data-testid={`scenario-link-${lesson.id}`}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/10 transition-colors"
                        title="Practice this concept in an educational scenario"
                      >
                        <Compass className="w-3 h-3 text-[#00F59B]" />
                        <span>Practice</span>
                      </Link>
                    ) : (
                      <Link
                        to="/scenarios"
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/10 transition-colors"
                        title="Explore Scenario Mode"
                      >
                        <Compass className="w-3 h-3 text-gray-400" />
                        <span>Scenarios</span>
                      </Link>
                    )}

                    <Link
                      to={`/quiz/quiz-${lesson.id}`}
                      data-testid={`take-quiz-link-${lesson.id}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-gray-300 border border-white/10 transition-colors"
                      title="Test your understanding with a 5-question quiz"
                    >
                      <HelpCircle className="w-3 h-3 text-[#00D4FF]" />
                      <span>Quiz</span>
                    </Link>

                    <Link
                      to={`/learn/${lesson.id}`}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                        isCompleted
                          ? 'bg-white/[0.05] hover:bg-white/10 text-gray-200'
                          : 'bg-[#00F59B] text-black hover:bg-[#00F59B]/90 shadow-[0_0_15px_rgba(0,245,155,0.2)]'
                      }`}
                    >
                      <span>{isCompleted ? 'Review' : 'Start'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Educational Sandbox Banner */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-[11px] text-gray-500 font-mono">
        <div>EDUCATIONAL CURRICULUM · Free virtual training. No financial advice or price predictions.</div>
      </div>
    </div>
  );
};

export default LearnPage;
