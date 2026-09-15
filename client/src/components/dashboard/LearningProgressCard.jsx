import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowRight, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';
import ProgressBar from '../ui/ProgressBar';
import Skeleton from '../ui/Skeleton';
import { getRecommendations } from '../../services/learningService';

/**
 * Phase 24: Dashboard Personalized Learning Path Card
 *
 * Supporting card displaying the user's next learning priority and concise reason.
 * Preserves existing dashboard balance and layout.
 */
const LearningProgressCard = () => {
  const [recommendation, setRecommendation] = useState(null);
  const [learningState, setLearningState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadLearningPath() {
      try {
        setLoading(true);
        const res = await getRecommendations();
        if (isMounted && res && res.data) {
          const recs = res.data.recommendations || [];
          setRecommendation(recs[0] || null);
          setLearningState(res.data.learningState || null);
        }
      } catch (err) {
        // Non-blocking fallback
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLearningPath();
    return () => {
      isMounted = false;
    };
  }, []);

  const completed = learningState?.completedLessons ?? 0;
  const total = learningState?.totalLessons || 15;
  const percent = Math.min(100, Math.round((completed / total) * 100));
  const isComplete = learningState?.isCurriculumComplete && !recommendation;

  const targetLink = recommendation?.lessonId ? `/learn/${recommendation.lessonId}` : '/learn';

  if (loading) {
    return (
      <div
        data-testid="dashboard-learning-card-loading"
        className="w-full rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.3)] space-y-4"
      >
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-36 rounded bg-white/[0.05]" />
          <Skeleton className="h-5 w-20 rounded-full bg-white/[0.05]" />
        </div>
        <Skeleton className="h-6 w-48 rounded bg-white/[0.07]" />
        <Skeleton className="h-10 w-full rounded-xl bg-white/[0.04]" />
        <Skeleton className="h-2.5 w-full rounded-full bg-white/[0.04]" />
      </div>
    );
  }

  return (
    <div
      data-testid="dashboard-learning-card"
      className="w-full rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] p-6 sm:p-7 backdrop-blur-xl flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.3)]"
    >
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B]">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F59B] uppercase">
                YOUR LEARNING PATH
              </span>
              <h3 className="text-base font-bold text-white font-sans" data-testid="dashboard-learning-next-title">
                {isComplete
                  ? 'Curriculum Completed'
                  : recommendation?.title || 'What Is Cryptocurrency?'}
              </h3>
            </div>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-slate-300">
            {completed} / {total} Lessons
          </span>
        </div>

        {/* Why this is recommended */}
        <div className="space-y-3 my-3">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <Sparkles className="w-3 h-3 text-[#00F59B]" />
              <span>Why Recommended</span>
            </div>
            <p className="text-slate-300 text-xs leading-relaxed" data-testid="dashboard-learning-why-reason">
              {isComplete
                ? 'All 15 core curriculum lessons have been completed. Review any lesson or practice in Scenario Mode.'
                : recommendation?.reason || 'Based on your current progress, this lesson builds your foundational understanding.'}
            </p>
          </div>

          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-gray-300 font-medium">Curriculum Progress</span>
            <span className="text-[#00F59B] font-mono font-bold">{percent}% Complete</span>
          </div>

          <ProgressBar
            value={percent}
            max={100}
            variant="green"
            showPercentage={false}
            className="my-1"
          />
        </div>
      </div>

      {/* Footer CTA */}
      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-sans">
          <BookOpen className="w-3.5 h-3.5 text-[#00F59B]" />
          <span>{isComplete ? 'All Modules Finished' : `Category: ${recommendation?.categoryLabel || 'Foundations'}`}</span>
        </div>
        <Link
          to={targetLink}
          data-testid="dashboard-learning-continue-btn"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00F59B] hover:text-white transition-colors"
        >
          <span>{isComplete ? 'Review Lessons' : 'Continue Learning'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default LearningProgressCard;
