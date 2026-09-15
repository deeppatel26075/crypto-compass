import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  BookOpen,
  Sparkles,
  RefreshCw,
  Compass,
  Award,
  Layers,
} from 'lucide-react';
import { getScenario, submitScenario, getScenarioProgress } from '../services/scenarioService';
import Skeleton from '../components/ui/Skeleton';

const CATEGORY_STYLES = {
  crypto_fundamentals: {
    badge: 'bg-[#00D4FF]/10 text-[#00D4FF] border-[#00D4FF]/30',
    accent: '#00D4FF',
  },
  market_basics: {
    badge: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
    accent: '#F59E0B',
  },
  trading_fundamentals: {
    badge: 'bg-[#00F59B]/10 text-[#00F59B] border-[#00F59B]/30',
    accent: '#00F59B',
  },
  risk_management: {
    badge: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
    accent: '#EF4444',
  },
  trading_discipline: {
    badge: 'bg-[#A855F7]/10 text-[#A855F7] border-[#A855F7]/30',
    accent: '#A855F7',
  },
};

const ASSESSMENT_BADGES = {
  STRONG: {
    label: 'Strong Application of Concept',
    badgeClass: 'bg-[#00F59B]/15 text-[#00F59B] border-[#00F59B]/30',
    textColor: '#00F59B',
  },
  REASONABLE: {
    label: 'Reasonable Approach',
    badgeClass: 'bg-[#00D4FF]/15 text-[#00D4FF] border-[#00D4FF]/30',
    textColor: '#00D4FF',
  },
  RISKY: {
    label: 'High-Risk Approach',
    badgeClass: 'bg-[#F59E0B]/15 text-[#F59E0B] border-[#F59E0B]/30',
    textColor: '#F59E0B',
  },
  UNHELPFUL: {
    label: 'Consider Alternative Approach',
    badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    textColor: '#F43F5E',
  },
};

const ScenarioPage = () => {
  const { scenarioId } = useParams();
  const navigate = useNavigate();

  const [scenario, setScenario] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [isPreviouslyCompleted, setIsPreviouslyCompleted] = useState(false);

  // Load scenario details and user's completion status
  const loadScenario = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [scenarioRes, progressRes] = await Promise.all([
        getScenario(scenarioId),
        getScenarioProgress().catch(() => ({ data: { completedScenarios: [] } })),
      ]);

      if (scenarioRes && scenarioRes.data) {
        setScenario(scenarioRes.data);
      } else {
        throw new Error('Scenario not found.');
      }

      const completed = progressRes?.data?.completedScenarios || [];
      if (completed.includes(scenarioId)) {
        setIsPreviouslyCompleted(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load scenario.');
    } finally {
      setLoading(false);
    }
  }, [scenarioId]);

  useEffect(() => {
    loadScenario();
  }, [loadScenario]);

  // Handle option selection
  const handleSelectOption = (optId) => {
    if (submitting || result) return;
    setSelectedOptionId(optId);
  };

  // Handle submission
  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!selectedOptionId || submitting) return;

    try {
      setSubmitting(true);
      const res = await submitScenario(scenarioId, selectedOptionId);
      if (res && res.data) {
        setResult(res.data);
        setIsPreviouslyCompleted(true);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to submit decision.');
    } finally {
      setSubmitting(false);
    }
  };

  // Retry action
  const handleRetry = () => {
    setResult(null);
    setSelectedOptionId('');
  };

  // Category styles
  const catStyle =
    CATEGORY_STYLES[scenario?.category] || CATEGORY_STYLES.crypto_fundamentals;

  // 1. Loading State
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6 pb-16" data-testid="scenario-loading">
        <Skeleton className="h-6 w-36 rounded-md" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-44 w-full rounded-2xl" />
        <Skeleton className="h-60 w-full rounded-2xl" />
      </div>
    );
  }

  // 2. 404 / Error State
  if (error || !scenario) {
    return (
      <div
        className="max-w-xl mx-auto my-12 p-8 rounded-3xl bg-[#050a0f] border border-white/[0.08] text-center space-y-6 shadow-2xl"
        data-testid="scenario-not-found"
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-white">Scenario Not Found</h2>
          <p className="text-sm text-gray-400">
            {error || 'The requested educational scenario does not exist.'}
          </p>
        </div>
        <Link
          to="/scenarios"
          data-testid="back-to-catalog-btn"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F59B] text-black font-semibold text-xs transition-colors hover:bg-[#00F59B]/90"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scenarios</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16" data-testid="scenario-detail-page">
      {/* Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/scenarios"
          data-testid="back-to-scenarios-link"
          className="inline-flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Scenarios</span>
        </Link>

        {isPreviouslyCompleted && (
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/20 text-xs font-semibold"
            data-testid="previously-completed-pill"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        )}
      </div>

      {/* Header Card */}
      <div
        className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-[#050a0f] border border-white/[0.08] shadow-2xl space-y-4"
        data-testid="scenario-header"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${catStyle.badge}`}
          >
            {scenario.categoryLabel || scenario.category}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/[0.06] text-gray-300 border border-white/[0.08]">
            {scenario.difficulty || 'BEGINNER'}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto font-mono">
            <Clock className="w-3.5 h-3.5" />
            <span>{scenario.estimatedMinutes} min</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
          {scenario.title}
        </h1>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          {scenario.description}
        </p>
      </div>

      {/* Realistic Educational Situation Context Card */}
      <div
        className="p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-white/[0.08] backdrop-blur-md space-y-3"
        data-testid="scenario-context-card"
      >
        <div className="flex items-center gap-2 text-xs font-semibold text-[#00D4FF] uppercase tracking-wider">
          <Compass className="w-4 h-4" />
          <span>Educational Situation Context</span>
        </div>
        <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
          {scenario.context}
        </p>
      </div>

      {/* If Result exists: Render Post-Submission Experience */}
      {result ? (
        <div className="space-y-6" data-testid="scenario-result-view">
          {/* Result Banner */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#050a0f] border border-white/[0.08] shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/20 text-[#00F59B] text-xs font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Scenario Complete</span>
              </div>

              {/* Assessment Badge */}
              {result.educationalQuality && (
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${
                    ASSESSMENT_BADGES[result.educationalQuality]?.badgeClass ||
                    'bg-white/10 text-white border-white/20'
                  }`}
                  data-testid="educational-quality-badge"
                >
                  {ASSESSMENT_BADGES[result.educationalQuality]?.label ||
                    result.educationalQuality}
                </div>
              )}
            </div>

            {/* Your Selected Option */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Your Decision
              </h3>
              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-sm text-gray-200 font-medium">
                {scenario.options.find((opt) => opt.id === result.selectedOptionId)?.text ||
                  result.selectedOptionId}
              </div>
            </div>

            {/* Server-Authoritative Pedagogical Explanation */}
            <div className="pt-2 space-y-2">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#00F59B]" />
                <span>Educational Assessment & Explanation</span>
              </h3>
              <div
                className="p-5 rounded-2xl bg-slate-900/60 border border-white/[0.06] text-sm sm:text-base text-gray-200 leading-relaxed"
                data-testid="scenario-explanation"
              >
                {result.explanation}
              </div>
            </div>

            {/* Key Concepts */}
            {result.keyConcepts && result.keyConcepts.length > 0 && (
              <div className="pt-2 space-y-2" data-testid="scenario-key-concepts">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#00D4FF]" />
                  <span>Key Concepts Applied</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keyConcepts.map((concept, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs text-gray-300 font-mono"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="p-6 rounded-2xl bg-[#050a0f] border border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={handleRetry}
                data-testid="retry-scenario-btn"
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-gray-200 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-white/10 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Try Again</span>
              </button>

              {scenario.lessonId && (
                <Link
                  to={`/learn/${scenario.lessonId}`}
                  data-testid="review-lesson-link"
                  className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-gray-200 text-xs sm:text-sm font-semibold flex items-center gap-2 border border-white/10 transition-colors"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#00D4FF]" />
                  <span>Review Lesson</span>
                </Link>
              )}
            </div>

            <Link
              to="/scenarios"
              data-testid="return-to-scenarios-btn"
              className="px-5 py-2 rounded-xl bg-[#00F59B] text-black font-bold text-xs sm:text-sm hover:bg-[#00F59B]/90 transition-colors"
            >
              Back to Scenarios
            </Link>
          </div>
        </div>
      ) : (
        /* Pre-Submission Decision Taking Flow */
        <div className="space-y-6" data-testid="scenario-decision-form">
          {/* Question Prompt */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#050a0f] border border-white/[0.08] shadow-2xl space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#00F59B] uppercase tracking-wider flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4" />
                <span>Decision Prompt</span>
              </span>
              <h2
                className="text-lg sm:text-xl font-bold text-white leading-snug"
                data-testid="scenario-question"
              >
                {scenario.question}
              </h2>
            </div>

            {/* Decision Option Cards */}
            <div
              className="space-y-3"
              role="radiogroup"
              aria-label="Decision Options"
              data-testid="scenario-options-group"
            >
              {scenario.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                const letter = String.fromCharCode(65 + idx);

                return (
                  <button
                    type="button"
                    key={option.id}
                    role="radio"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => handleSelectOption(option.id)}
                    onKeyDown={(e) => {
                      if (e.key === ' ' || e.key === 'Enter') {
                        e.preventDefault();
                        handleSelectOption(option.id);
                      }
                    }}
                    data-testid={`option-card-${option.id}`}
                    className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 outline-none focus:ring-2 focus:ring-[#00F59B]/50 ${
                      isSelected
                        ? 'bg-[#00F59B]/10 border-[#00F59B] shadow-[0_0_20px_rgba(0,245,155,0.15)]'
                        : 'bg-white/[0.02] hover:bg-white/[0.05] border-white/[0.08]'
                    }`}
                  >
                    {/* Option Indicator */}
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isSelected
                          ? 'bg-[#00F59B] text-black shadow-[0_0_10px_rgba(0,245,155,0.4)]'
                          : 'bg-white/[0.05] text-gray-400 border border-white/[0.08]'
                      }`}
                    >
                      {letter}
                    </div>

                    {/* Option Text */}
                    <div className="flex-1 text-xs sm:text-sm text-gray-200 leading-relaxed pt-0.5">
                      {option.text}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Decision Button Card */}
          <div className="p-6 rounded-2xl bg-[#050a0f] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              {selectedOptionId
                ? 'Option selected. Submit to evaluate the educational rationale.'
                : 'Select one of the choices above to submit your decision.'}
            </p>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedOptionId || submitting}
              data-testid="submit-decision-btn"
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                !selectedOptionId || submitting
                  ? 'bg-white/[0.05] text-gray-500 cursor-not-allowed border border-white/5'
                  : 'bg-[#00F59B] text-black hover:bg-[#00F59B]/90 shadow-[0_0_20px_rgba(0,245,155,0.3)] active:scale-98'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{submitting ? 'Evaluating...' : 'Submit Decision'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Safety Notice */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-[11px] text-gray-500 font-mono">
        <div>EDUCATIONAL EVALUATION · Decision exercises reinforce conceptual knowledge. Zero financial advice or price predictions.</div>
      </div>
    </div>
  );
};

export default ScenarioPage;
