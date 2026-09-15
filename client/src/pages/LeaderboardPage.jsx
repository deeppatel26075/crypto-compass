import React, { useState, useEffect, useCallback } from 'react';
import {
  Trophy,
  Medal,
  Award,
  BookOpen,
  HelpCircle,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Shield,
  User as UserIcon,
} from 'lucide-react';
import { getLeaderboard } from '../services/leaderboardService';
import Skeleton from '../components/ui/Skeleton';

const LeaderboardPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getLeaderboard(50);
      if (res && res.data) {
        setData(res.data);
      } else {
        throw new Error('Invalid response from leaderboard API');
      }
    } catch (err) {
      setError(err.message || 'Failed to load leaderboard.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const leaderboard = data?.leaderboard || [];
  const currentUser = data?.currentUser || null;
  const totalParticipants = data?.totalParticipants || leaderboard.length;

  const topThree = leaderboard.slice(0, 3);
  const remainingUsers = leaderboard.slice(3);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16" data-testid="leaderboard-page">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c131a] via-[#050a0f] to-[#020609] border border-white/[0.08] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#00F59B]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold tracking-wide">
              <Trophy className="w-3.5 h-3.5" />
              <span>EDUCATIONAL MERIT & PROGRESSION</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Global Leaderboard
            </h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Recognizing dedicated learners and disciplined paper traders. Rankings reflect legitimate educational
              milestones, assessment scores, and completed challenges.
            </p>
          </div>

          {/* Current User Standings Card */}
          {currentUser && (
            <div className="flex items-center gap-4 bg-white/[0.03] backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-amber-500/20 shrink-0 shadow-lg shadow-amber-500/5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400/20 to-amber-600/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold text-lg font-mono">
                #{currentUser.rank || '—'}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                    Your Standing
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/20 font-semibold">
                    YOU
                  </span>
                </div>
                <div className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="font-mono">{currentUser.totalXp.toLocaleString()} XP</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  {currentUser.challengesCount} Quests · {currentUser.lessonsCount} Lessons
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3"
              >
                <Skeleton className="w-12 h-12 rounded-xl" />
                <Skeleton className="w-3/4 h-6 rounded-lg" />
                <Skeleton className="w-1/2 h-4 rounded-lg" />
              </div>
            ))}
          </div>
          <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-full h-12 rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {/* Error View */}
      {error && !loading && (
        <div className="p-8 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-400 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-white">Failed to load leaderboard</h3>
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

      {/* Leaderboard Content */}
      {!loading && !error && (
        <div className="space-y-8">
          {/* Top 3 Podium Showcase */}
          {topThree.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {topThree.map((user) => {
                const isFirst = user.rank === 1;
                const isSecond = user.rank === 2;
                const isThird = user.rank === 3;

                const borderColor = isFirst
                  ? 'border-amber-400/40'
                  : isSecond
                  ? 'border-slate-300/30'
                  : 'border-amber-600/30';

                const badgeBg = isFirst
                  ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                  : isSecond
                  ? 'bg-slate-300/10 text-slate-300 border-slate-300/30'
                  : 'bg-amber-600/10 text-amber-500 border-amber-600/30';

                return (
                  <div
                    key={user.userId}
                    className={`relative rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between border bg-white/[0.02] hover:bg-white/[0.03] ${borderColor} ${
                      user.isCurrentUser ? 'ring-1 ring-[#00F59B]' : ''
                    }`}
                  >
                    <div className="space-y-4">
                      {/* Top Rank Badge */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border font-mono ${badgeBg}`}
                        >
                          <Trophy className="w-3.5 h-3.5" />
                          <span>RANK #{user.rank}</span>
                        </span>
                        {user.isCurrentUser && (
                          <span className="text-[10px] uppercase font-bold text-[#00F59B] bg-[#00F59B]/10 border border-[#00F59B]/20 px-2 py-0.5 rounded-full">
                            YOU
                          </span>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold text-white truncate">
                          {user.displayName}
                        </h3>
                        <div className="flex items-center gap-1.5 text-amber-400 font-mono text-base font-bold">
                          <Sparkles className="w-4 h-4" />
                          <span>{user.totalXp.toLocaleString()} XP</span>
                        </div>
                      </div>

                      {/* Stats Pills */}
                      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] text-center">
                        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <div className="text-xs font-bold text-white font-mono">
                            {user.challengesCount}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                            Quests
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <div className="text-xs font-bold text-white font-mono">
                            {user.lessonsCount}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                            Lessons
                          </div>
                        </div>
                        <div className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <div className="text-xs font-bold text-white font-mono">
                            {user.quizzesCount}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                            Quizzes
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Full Leaderboard Table (Desktop) & Cards (Mobile) */}
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] bg-white/[0.03] text-slate-400 font-semibold tracking-wider uppercase text-[11px]">
                    <th className="py-3.5 px-5">Rank</th>
                    <th className="py-3.5 px-5">Trader / Learner</th>
                    <th className="py-3.5 px-5 text-right">Total XP</th>
                    <th className="py-3.5 px-5 text-center">Quests</th>
                    <th className="py-3.5 px-5 text-center">Lessons</th>
                    <th className="py-3.5 px-5 text-center">Quizzes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {leaderboard.map((user) => {
                    const isSelf = user.isCurrentUser;
                    return (
                      <tr
                        key={user.userId}
                        className={`transition-colors hover:bg-white/[0.03] ${
                          isSelf ? 'bg-[#00F59B]/[0.04]' : ''
                        }`}
                      >
                        <td className="py-3 px-5 font-mono font-bold text-slate-300">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs ${
                              user.rank === 1
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : user.rank === 2
                                ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30'
                                : user.rank === 3
                                ? 'bg-amber-600/20 text-amber-400 border border-amber-600/30'
                                : 'text-slate-400'
                            }`}
                          >
                            #{user.rank}
                          </span>
                        </td>
                        <td className="py-3 px-5">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white truncate max-w-[200px]">
                              {user.displayName}
                            </span>
                            {isSelf && (
                              <span className="text-[10px] uppercase font-bold text-[#00F59B] bg-[#00F59B]/10 border border-[#00F59B]/20 px-2 py-0.5 rounded-full">
                                YOU
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-5 text-right font-mono font-bold text-amber-400">
                          {user.totalXp.toLocaleString()} XP
                        </td>
                        <td className="py-3 px-5 text-center font-mono text-slate-300">
                          {user.challengesCount}
                        </td>
                        <td className="py-3 px-5 text-center font-mono text-slate-300">
                          {user.lessonsCount}
                        </td>
                        <td className="py-3 px-5 text-center font-mono text-slate-300">
                          {user.quizzesCount}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (<768px) */}
            <div className="md:hidden divide-y divide-white/[0.06]">
              {leaderboard.map((user) => {
                const isSelf = user.isCurrentUser;
                return (
                  <div
                    key={user.userId}
                    className={`p-4 space-y-2.5 transition-colors ${
                      isSelf ? 'bg-[#00F59B]/[0.04]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-white/[0.06] text-slate-300">
                          #{user.rank}
                        </span>
                        <span className="text-sm font-semibold text-white truncate max-w-[160px]">
                          {user.displayName}
                        </span>
                        {isSelf && (
                          <span className="text-[9px] font-bold text-[#00F59B] bg-[#00F59B]/10 border border-[#00F59B]/20 px-1.5 py-0.5 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs font-bold text-amber-400">
                        {user.totalXp.toLocaleString()} XP
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-400 font-mono">
                      <span>Quests: <strong className="text-slate-200">{user.challengesCount}</strong></span>
                      <span>Lessons: <strong className="text-slate-200">{user.lessonsCount}</strong></span>
                      <span>Quizzes: <strong className="text-slate-200">{user.quizzesCount}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
