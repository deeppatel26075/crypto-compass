import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  HelpCircle,
  Compass,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { getChallengeProgress, claimChallenge } from '../services/challengeService';
import Skeleton from '../components/ui/Skeleton';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Challenges' },
  { id: 'LEARNING', label: 'Learning' },
  { id: 'QUIZ', label: 'Quizzes' },
  { id: 'SCENARIO', label: 'Scenarios' },
  { id: 'TRADING', label: 'Paper Trading' },
  { id: 'DISCIPLINE', label: 'Discipline' },
];

const CATEGORY_THEMES = {
  LEARNING: {
    color: '#00D4FF', // Cyan
    bg: 'bg-[#00D4FF]/10',
    border: 'border-[#00D4FF]/30',
    text: 'text-[#00D4FF]',
    icon: BookOpen,
    label: 'Learning',
    actionRoute: '/learn',
    actionText: 'Go to Lessons',
  },
  QUIZ: {
    color: '#A855F7', // Purple
    bg: 'bg-[#A855F7]/10',
    border: 'border-[#A855F7]/30',
    text: 'text-[#A855F7]',
    icon: HelpCircle,
    label: 'Quiz',
    actionRoute: '/learn',
    actionText: 'Browse Quizzes',
  },
  SCENARIO: {
    color: '#F59E0B', // Amber
    bg: 'bg-[#F59E0B]/10',
    border: 'border-[#F59E0B]/30',
    text: 'text-[#F59E0B]',
    icon: Compass,
    label: 'Scenario',
    actionRoute: '/scenarios',
    actionText: 'Explore Scenarios',
  },
  TRADING: {
    color: '#00F59B', // Neon Green
    bg: 'bg-[#00F59B]/10',
    border: 'border-[#00F59B]/30',
    text: 'text-[#00F59B]',
    icon: TrendingUp,
    label: 'Paper Trading',
    actionRoute: '/markets',
    actionText: 'Open Markets',
  },
  DISCIPLINE: {
    color: '#3B82F6', // Blue
    bg: 'bg-[#3B82F6]/10',
    border: 'border-[#3B82F6]/30',
    text: 'text-[#3B82F6]',
    icon: ShieldCheck,
    label: 'Discipline',
    actionRoute: '/learn',
    actionText: 'Practice Now',
  },
};

const DIFFICULTY_BADGES = {
  BEGINNER: { label: 'Beginner', text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
  INTERMEDIATE: { label: 'Intermediate', text: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
  ADVANCED: { label: 'Advanced', text: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
};

const ChallengesPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [claimingId, setClaimingId] = useState(null);
  const [claimNotification, setClaimNotification] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getChallengeProgress();
      if (res && res.data) {
        setData(res.data);
      } else {
        throw new Error('Invalid response from challenges API');
      }
    } catch (err) {
      setError(err.message || 'Failed to load challenges.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleClaim = async (challengeId) => {
    try {
      setClaimingId(challengeId);
      setClaimNotification(null);
      const res = await claimChallenge(challengeId);
      if (res && res.data) {
        setClaimNotification({
          type: 'success',
          message: res.data.message,
        });
        await fetchData();
      }
    } catch (err) {
      setClaimNotification({
        type: 'error',
        message: err.message || 'Failed to claim challenge reward.',
      });
    } finally {
      setClaimingId(null);
    }
  };

  const challenges = data?.challenges || [];

  const filteredChallenges = useMemo(() => {
    if (selectedCategory === 'all') return challenges;
    return challenges.filter((c) => c.category === selectedCategory);
  }, [challenges, selectedCategory]);

  const totalXp = data?.totalXp || 0;
  const challengeXp = data?.challengeXp || 0;
  const quizXp = data?.quizXp || 0;
  const completedCount = data?.completedCount || 0;
  const totalCount = data?.totalCount || challenges.length || 9;

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16" data-testid="challenges-page">
      {/* 1. Header Banner with Genuine Progression Stats (Zero Fabricated Levels) */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c131a] via-[#050a0f] to-[#020609] border border-white/[0.08] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F59B]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#00D4FF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/20 text-[#00F59B] text-xs font-semibold tracking-wide">
              <Award className="w-3.5 h-3.5" />
              <span>EDUCATIONAL QUESTS & PRACTICE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Challenges & Quests
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Reinforce cryptocurrency knowledge and disciplined paper trading through structured milestones.
              Earn XP for verified achievements across learning, quizzes, and simulated trading.
            </p>
          </div>

          {/* Genuine Progression Overview Card */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white/[0.03] backdrop-blur-md p-4 rounded-2xl border border-white/[0.06] shrink-0">
            <div className="px-3 py-2 text-center border-r border-white/[0.06] last:border-0">
              <div className="flex items-center justify-center gap-1.5 text-amber-400">
                <Sparkles className="w-4 h-4" />
                <span className="text-xl font-bold font-mono">{totalXp.toLocaleString()}</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Total XP
              </span>
            </div>

            <div className="px-3 py-2 text-center border-r border-white/[0.06] last:border-0">
              <div className="text-xl font-bold text-white font-mono">
                {completedCount} <span className="text-slate-500 text-sm">/ {totalCount}</span>
              </div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                Completed
              </span>
            </div>

            <div className="px-3 py-2 text-center">
              <div className="text-xs font-mono text-slate-300">
                <span className="text-[#A855F7] font-semibold">{quizXp}</span> Quiz /{' '}
                <span className="text-[#00F59B] font-semibold">{challengeXp}</span> Quest
              </div>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                XP Breakdown
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Banner */}
      {claimNotification && (
        <div
          className={`p-4 rounded-2xl border flex items-center justify-between gap-3 text-sm transition-all ${
            claimNotification.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {claimNotification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            )}
            <span>{claimNotification.message}</span>
          </div>
          <button
            onClick={() => setClaimNotification(null)}
            className="text-xs opacity-70 hover:opacity-100 uppercase tracking-wider font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.06]">
        {CATEGORY_TABS.map((tab) => {
          const isActive = selectedCategory === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-white/[0.1] text-white border border-white/[0.15] shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-16 h-6 rounded-full" />
              </div>
              <Skeleton className="w-3/4 h-6 rounded-lg" />
              <Skeleton className="w-full h-12 rounded-lg" />
              <Skeleton className="w-full h-2 rounded-full" />
              <Skeleton className="w-full h-10 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Error View */}
      {error && !loading && (
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">Failed to load challenges</h3>
            <p className="text-xs text-slate-400">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-medium transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* Challenges Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((challenge) => {
            const theme = CATEGORY_THEMES[challenge.category] || CATEGORY_THEMES.LEARNING;
            const diff = DIFFICULTY_BADGES[challenge.difficulty] || DIFFICULTY_BADGES.BEGINNER;
            const Icon = theme.icon;
            const isClaiming = claimingId === challenge.challengeId;

            return (
              <div
                key={challenge.challengeId}
                className={`relative rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between border ${
                  challenge.isCompleted
                    ? 'bg-[#00F59B]/[0.02] border-[#00F59B]/20'
                    : challenge.canClaim
                    ? 'bg-white/[0.03] border-[#00F59B]/40 shadow-lg shadow-[#00F59B]/5'
                    : 'bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]'
                }`}
              >
                <div className="space-y-4">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${theme.bg} ${theme.border} ${theme.text}`}
                      >
                        <Icon className="w-3 h-3" />
                        <span>{theme.label}</span>
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${diff.bg} ${diff.text}`}
                      >
                        {diff.label}
                      </span>
                    </div>

                    {/* Reward XP Badge */}
                    <div className="flex items-center gap-1 text-amber-400 font-mono text-xs font-bold bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                      <Zap className="w-3 h-3 fill-amber-400" />
                      <span>+{challenge.rewardXp} XP</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-white tracking-tight">
                      {challenge.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed min-h-[36px]">
                      {challenge.description}
                    </p>
                  </div>

                  {/* Objective & Progress Bar */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 text-[11px] font-medium">Objective:</span>
                      <span className="font-mono text-xs text-slate-300 font-medium">
                        {challenge.currentValue} / {challenge.targetValue}
                      </span>
                    </div>
                    <div className="w-full bg-white/[0.05] rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          challenge.isCompleted
                            ? 'bg-[#00F59B]'
                            : challenge.canClaim
                            ? 'bg-amber-400'
                            : 'bg-[#00D4FF]'
                        }`}
                        style={{ width: `${challenge.progressPercent}%` }}
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 italic">
                      {challenge.objective}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="pt-6 mt-4 border-t border-white/[0.04]">
                  {challenge.isCompleted ? (
                    <div className="w-full py-2.5 rounded-xl bg-[#00F59B]/10 border border-[#00F59B]/20 text-[#00F59B] text-xs font-semibold flex items-center justify-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Completed & Claimed</span>
                    </div>
                  ) : challenge.canClaim ? (
                    <button
                      onClick={() => handleClaim(challenge.challengeId)}
                      disabled={isClaiming}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#00F59B] to-[#00D4FF] hover:brightness-110 active:scale-[0.99] text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-[#00F59B]/20 transition disabled:opacity-50"
                    >
                      {isClaiming ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying & Claiming...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Claim +{challenge.rewardXp} XP</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <Link
                      to={challenge.requirements?.type === 'FULL_POSITION_EXIT' ? '/portfolio' : theme.actionRoute}
                      className="w-full py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-medium flex items-center justify-center gap-1.5 transition"
                    >
                      <span>
                        {challenge.requirements?.type === 'FULL_POSITION_EXIT'
                          ? 'Open Portfolio'
                          : theme.actionText}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChallengesPage;
