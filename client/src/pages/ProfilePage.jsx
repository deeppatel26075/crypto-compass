import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  BookOpen,
  HelpCircle,
  Compass,
  TrendingUp,
  Crown,
  CheckCircle2,
  Lock,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Zap,
  User,
  Calendar,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getAchievementProgress, evaluateAchievements } from '../services/achievementService';
import { getRecommendations } from '../services/learningService';
import Skeleton from '../components/ui/Skeleton';

// 8 Required Filter Tabs
const FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'unlocked', label: 'Unlocked' },
  { id: 'locked', label: 'Locked' },
  { id: 'LEARNING', label: 'Learning' },
  { id: 'ASSESSMENT', label: 'Assessment' },
  { id: 'PRACTICE', label: 'Practice' },
  { id: 'TRADING', label: 'Trading' },
  { id: 'MASTERY', label: 'Mastery' },
];

const CATEGORY_CONFIG = {
  LEARNING: {
    color: '#00D4FF',
    bg: 'bg-[#00D4FF]/10',
    border: 'border-[#00D4FF]/30',
    text: 'text-[#00D4FF]',
    icon: BookOpen,
    label: 'Learning',
  },
  ASSESSMENT: {
    color: '#A855F7',
    bg: 'bg-[#A855F7]/10',
    border: 'border-[#A855F7]/30',
    text: 'text-[#A855F7]',
    icon: HelpCircle,
    label: 'Assessment',
  },
  PRACTICE: {
    color: '#F59E0B',
    bg: 'bg-[#F59E0B]/10',
    border: 'border-[#F59E0B]/30',
    text: 'text-[#F59E0B]',
    icon: Compass,
    label: 'Practice',
  },
  TRADING: {
    color: '#10B981',
    bg: 'bg-[#10B981]/10',
    border: 'border-[#10B981]/30',
    text: 'text-[#10B981]',
    icon: TrendingUp,
    label: 'Trading',
  },
  MASTERY: {
    color: '#EAB308',
    bg: 'bg-[#EAB308]/10',
    border: 'border-[#EAB308]/30',
    text: 'text-[#EAB308]',
    icon: Crown,
    label: 'Mastery',
  },
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [progressData, setProgressData] = useState(null);
  const [newlyUnlockedIds, setNewlyUnlockedIds] = useState([]);
  const [learningRec, setLearningRec] = useState(null);
  const [learningState, setLearningState] = useState(null);

  // Load progress data (or run evaluate)
  const loadData = useCallback(async (shouldEvaluate = false) => {
    try {
      setError(null);
      if (shouldEvaluate) {
        setEvaluating(true);
        const evalRes = await evaluateAchievements();
        if (evalRes && evalRes.success) {
          const unlockedList = evalRes.data?.newlyUnlocked || evalRes.newlyUnlocked || [];
          if (unlockedList.length > 0) {
            setNewlyUnlockedIds(unlockedList.map(u => u.achievementId));
          }
        }
      }
      const [res, recRes] = await Promise.all([
        getAchievementProgress(),
        getRecommendations().catch(() => null),
      ]);
      if (res && res.success) {
        setProgressData(res.data);
      } else {
        setError(res?.message || 'Failed to load achievement progress.');
      }
      if (recRes && recRes.data) {
        setLearningRec((recRes.data.recommendations || [])[0] || null);
        setLearningState(recRes.data.learningState || null);
      }
    } catch (err) {
      console.error('Failed to load profile data:', err);
      setError('An error occurred while loading profile progress.');
    } finally {
      setLoading(false);
      setEvaluating(false);
    }
  }, []);

  // Initial load: evaluate first on mount to make sure any recent progress is recognized
  useEffect(() => {
    loadData(true);
  }, [loadData]);

  // Compute filtered achievements
  const filteredAchievements = useMemo(() => {
    if (!progressData || !progressData.achievements) return [];
    const list = progressData.achievements;

    if (activeTab === 'all') return list;
    if (activeTab === 'unlocked') return list.filter(a => a.isUnlocked);
    if (activeTab === 'locked') return list.filter(a => !a.isUnlocked);
    return list.filter(a => a.category === activeTab);
  }, [progressData, activeTab]);

  // Format date helper
  const formatDate = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  const unlockedCount = progressData?.unlockedCount || 0;
  const totalCount = progressData?.totalAchievements || 12;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div data-testid="profile-page" className="min-h-screen bg-[#0B0E17] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* TOP HEADER: User Profile Card */}
        <div className="bg-[#151926] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center space-x-5">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-cyan-900/30 font-bold text-2xl">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : <User className="w-10 h-10" />}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                  {user?.name || 'Explorer'}
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-medium">
                    Crypto Scholar
                  </span>
                </h1>
                <p className="text-sm text-slate-400 mt-1">{user?.email}</p>
                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    Member since {formatDate(user?.createdAt || new Date())}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" />
                    Verified Student
                  </span>
                </div>
              </div>
            </div>

            {/* Manual Sync / Evaluate Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => loadData(true)}
                disabled={evaluating || loading}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-sm font-medium flex items-center gap-2 transition shadow-sm hover:text-white disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${evaluating ? 'animate-spin text-cyan-400' : ''}`} />
                {evaluating ? 'Checking Progress...' : 'Check Achievements'}
              </button>
            </div>
          </div>
        </div>

        {/* PROGRESSION METRICS (NO FABRICATED LEVEL FORMULA) */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-2xl bg-slate-800/60" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total XP */}
            <div className="bg-[#151926] border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <span>Total XP</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-3 text-3xl font-extrabold text-white tracking-tight">
                {progressData?.totalXp?.toLocaleString() || 0}
              </div>
              <p className="mt-1 text-xs text-slate-500">Cumulative verified XP</p>
            </div>

            {/* Quiz XP */}
            <div className="bg-[#151926] border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <span>Quiz XP</span>
                <HelpCircle className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-3 text-2xl font-bold text-white tracking-tight">
                {progressData?.quizXp?.toLocaleString() || 0}
              </div>
              <p className="mt-1 text-xs text-slate-500">Assessments passed</p>
            </div>

            {/* Challenge XP */}
            <div className="bg-[#151926] border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <span>Challenge XP</span>
                <Zap className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-3 text-2xl font-bold text-white tracking-tight">
                {progressData?.challengeXp?.toLocaleString() || 0}
              </div>
              <p className="mt-1 text-xs text-slate-500">Milestones completed</p>
            </div>

            {/* Achievement XP */}
            <div className="bg-[#151926] border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <span>Achievement XP</span>
                <Award className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="mt-3 text-2xl font-bold text-white tracking-tight">
                {progressData?.achievementXp?.toLocaleString() || 0}
              </div>
              <p className="mt-1 text-xs text-slate-500">Earned honors</p>
            </div>

            {/* Unlocked Badges */}
            <div className="bg-[#151926] border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden col-span-2 sm:col-span-1">
              <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider">
                <span>Achievements</span>
                <Crown className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="mt-3 text-2xl font-bold text-white tracking-tight flex items-baseline gap-2">
                <span>{unlockedCount}</span>
                <span className="text-sm font-normal text-slate-500">/ {totalCount}</span>
              </div>
              <div className="mt-2 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-400 to-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Phase 24: PERSONALIZED LEARNING SECTION */}
        <div
          data-testid="profile-personalized-learning"
          className="p-5 sm:p-6 rounded-2xl bg-[#151926] border border-slate-800/80 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  PERSONALIZED LEARNING
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-0.5" data-testid="profile-focus-title">
                Current Focus: {learningRec?.title || 'What Is Cryptocurrency?'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5" data-testid="profile-learning-progress">
                Progress: <strong className="text-white">{learningState?.completedLessons ?? 0}</strong> / {learningState?.totalLessons || 15} lessons completed
              </p>
            </div>
          </div>

          <Link
            to="/learn"
            data-testid="profile-view-path-btn"
            className="px-4 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-400 hover:text-cyan-300 font-semibold text-xs flex items-center gap-2 transition shrink-0"
          >
            <span>View Learning Path</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ACHIEVEMENTS SECTION */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Award className="w-6 h-6 text-cyan-400" />
                Achievements & Badges
              </h2>
              <p className="text-sm text-slate-400 mt-1">
                Deterministic badges unlocked through educational mastery, disciplined practice, and verified milestone completion.
              </p>
            </div>

            <div className="text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/50 flex items-center gap-2 self-start sm:self-auto">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{unlockedCount} of {totalCount} Unlocked ({progressPercent}%)</span>
            </div>
          </div>

          {/* FILTER TABS */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none">
            {FILTER_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-950/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                >
                  {tab.label}
                  {tab.id === 'unlocked' && ` (${unlockedCount})`}
                  {tab.id === 'locked' && ` (${totalCount - unlockedCount})`}
                </button>
              );
            })}
          </div>

          {/* ERROR ALERT */}
          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ACHIEVEMENTS GRID */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-2xl bg-slate-800/50" />
              ))}
            </div>
          ) : filteredAchievements.length === 0 ? (
            <div className="bg-[#151926] border border-slate-800/80 rounded-2xl p-12 text-center">
              <Award className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No achievements match filter</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select another filter tab above or continue your learning journey to unlock new milestones.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredAchievements.map((achievement) => {
                const achId = achievement.achievementId || achievement.id;
                const isUnlocked = achievement.isUnlocked;
                const theme = CATEGORY_CONFIG[achievement.category] || CATEGORY_CONFIG.LEARNING;
                const IconComponent = theme.icon;
                const isNewlyUnlocked = newlyUnlockedIds.includes(achId);
                const criteriaText = achievement.requirement?.label || achievement.criteriaDescription || 'Fulfill requirement';
                const rewardXp = achievement.rewardXp || achievement.xpReward || 50;

                return (
                  <div
                    key={achId}
                    className={`relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-[#151926] border border-slate-700/70 shadow-lg shadow-slate-950/40 hover:border-slate-600'
                        : 'bg-[#121520]/80 border border-slate-800/50 opacity-75 hover:opacity-90'
                    } ${isNewlyUnlocked ? 'ring-2 ring-cyan-400 animate-pulse' : ''}`}
                  >
                    <div>
                      {/* CARD TOP BAR */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform ${
                              isUnlocked ? theme.bg : 'bg-slate-800/70 grayscale'
                            }`}
                          >
                            <span>{achievement.icon || '🏅'}</span>
                          </div>
                          <div>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                isUnlocked
                                  ? `${theme.bg} ${theme.text} ${theme.border} border`
                                  : 'bg-slate-800 text-slate-400 border border-slate-700/50'
                              }`}
                            >
                              {theme.label}
                            </span>
                            <h3 className="text-base font-bold text-white mt-1 leading-snug">
                              {achievement.title}
                            </h3>
                          </div>
                        </div>

                        {/* STATUS BADGE */}
                        {isUnlocked ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Unlocked
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-slate-500 text-xs font-semibold bg-slate-800/80 px-2 py-1 rounded-lg">
                            <Lock className="w-3.5 h-3.5" />
                            Locked
                          </span>
                        )}
                      </div>

                      {/* DESCRIPTION */}
                      <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                        {achievement.description}
                      </p>

                      {/* CRITERIA DESCRIPTION */}
                      <div className="mt-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400">
                        <span className="font-semibold text-slate-300">Criteria: </span>
                        {criteriaText}
                      </div>
                    </div>

                    {/* CARD FOOTER */}
                    <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-amber-400 font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>+{rewardXp} XP</span>
                      </div>

                      {isUnlocked && achievement.unlockedAt && (
                        <span className="text-slate-400 text-[11px]">
                          Earned {formatDate(achievement.unlockedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* EDUCATIONAL DISCLAIMER BANNER */}
        <div className="bg-[#151926]/60 border border-slate-800 rounded-xl p-4 text-xs text-slate-400 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <span>
              Crypto Compass achievements represent simulation and educational progress only. XP, badges, and progress have zero monetary value and do not constitute financial advice.
            </span>
          </div>
          <Link
            to="/leaderboard"
            className="text-cyan-400 hover:text-cyan-300 font-medium whitespace-nowrap transition"
          >
            View Leaderboard &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
