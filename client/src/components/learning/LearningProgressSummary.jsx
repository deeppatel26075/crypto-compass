import React from 'react';
import { BookOpen, HelpCircle, Compass, Target } from 'lucide-react';
import Skeleton from '../ui/Skeleton';

/**
 * Phase 24: Learning Progress Summary Component
 *
 * Compact, factual display of learning metrics:
 * - Lessons completed / 15
 * - Quizzes passed / 15
 * - Scenarios completed / 10
 * - Current learning focus topic
 */
const LearningProgressSummary = ({
  learningState = null,
  activeFocus = null,
  loading = false,
}) => {
  if (loading) {
    return (
      <div
        data-testid="learning-progress-summary-loading"
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 animate-pulse"
      >
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-[#0a1420]/80 border border-white/[0.08] space-y-2">
            <Skeleton className="h-3 w-20 rounded bg-white/[0.05]" />
            <Skeleton className="h-6 w-16 rounded bg-white/[0.08]" />
          </div>
        ))}
      </div>
    );
  }

  const completedLessons = learningState?.completedLessons ?? 0;
  const totalLessons = learningState?.totalLessons || 15;
  const completedQuizzes = learningState?.completedQuizzes ?? 0;
  const totalQuizzes = learningState?.totalQuizzes || 15;
  const completedScenarios = learningState?.completedScenarios ?? 0;
  const totalScenarios = learningState?.totalScenarios || 10;

  const focusTopic = activeFocus?.categoryLabel || activeFocus?.title || 'Core Foundations';

  return (
    <div
      data-testid="learning-progress-summary"
      className="p-5 rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] backdrop-blur-xl shadow-xl space-y-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-[#00F59B]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Your Learning Progress
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span>Active Focus:</span>
          <span className="text-[#00F59B] font-semibold" data-testid="summary-active-focus">
            {focusTopic}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Lessons */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-slate-300 font-medium">Lessons</span>
          </div>
          <span className="text-sm font-mono font-bold text-white" data-testid="summary-lessons-metric">
            {completedLessons} / {totalLessons}
          </span>
        </div>

        {/* Quizzes */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <HelpCircle className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-slate-300 font-medium">Quizzes</span>
          </div>
          <span className="text-sm font-mono font-bold text-white" data-testid="summary-quizzes-metric">
            {completedQuizzes} / {totalQuizzes}
          </span>
        </div>

        {/* Scenarios */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs text-slate-300 font-medium">Scenarios</span>
          </div>
          <span className="text-sm font-mono font-bold text-white" data-testid="summary-scenarios-metric">
            {completedScenarios} / {totalScenarios}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LearningProgressSummary;
