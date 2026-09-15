import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertCircle,
  Clock,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  RefreshCw,
  TrendingUp,
  GraduationCap,
  Info,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  Sparkles,
  BarChart3,
  Shuffle,
  Calendar,
  Split,
  Timer,
  PieChart,
  Repeat,
} from 'lucide-react';
import { getAnalysisSummary } from '../services/analysisService';
import Skeleton from '../components/ui/Skeleton';

/**
 * Helper to format minutes into human-readable duration
 * @param {number} minutes
 * @returns {string}
 */
function formatDurationMinutes(minutes) {
  if (typeof minutes !== 'number' || isNaN(minutes) || minutes <= 0) return '0 min';
  if (minutes < 60) return `${minutes} min`;
  if (minutes < 1440) {
    const hrs = (minutes / 60).toFixed(1);
    return `${hrs} hr${hrs === '1.0' ? '' : 's'}`;
  }
  const days = (minutes / 1440).toFixed(1);
  return `${days} day${days === '1.0' ? '' : 's'}`;
}

const CATEGORY_COLORS = {
  OVERTRADING: {
    badgeBg: 'bg-amber-500/10',
    badgeText: 'text-amber-400',
    border: 'border-amber-500/30',
  },
  RAPID_ENTRY_EXIT: {
    badgeBg: 'bg-purple-500/10',
    badgeText: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  CONCENTRATION: {
    badgeBg: 'bg-[#00D4FF]/10',
    badgeText: 'text-[#00D4FF]',
    border: 'border-[#00D4FF]/30',
  },
  POSITION_SIZING: {
    badgeBg: 'bg-rose-500/10',
    badgeText: 'text-rose-400',
    border: 'border-rose-500/30',
  },
  FOMO_PATTERN: {
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-400',
    border: 'border-cyan-500/30',
  },
};

const AnalysisPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalysis = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAnalysisSummary();
      if (res && res.data) {
        setData(res.data);
      } else {
        throw new Error('Invalid analysis response received from server.');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to load trade analysis.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  const metrics = data?.metrics || {
    totalTrades: 0,
    buyTrades: 0,
    sellTrades: 0,
    uniqueAssets: 0,
  };

  const observations = data?.observations || [];
  const totalTrades = metrics.totalTrades;
  const behavioral = data?.behavioralAnalytics;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16" data-testid="analysis-page">
      {/* 1. SECTION 1 — ANALYSIS HEADER */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c131a] via-[#050a0f] to-[#020609] border border-white/[0.08] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00D4FF]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#00F59B]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[#00D4FF] text-xs font-semibold tracking-wide">
              <Activity className="w-3.5 h-3.5" />
              <span>BEHAVIORAL ANALYTICS &amp; MISTAKE ANALYZER</span>
            </div>

            {data?.dataState && (
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${
                data.dataState === 'SUFFICIENT'
                  ? 'bg-[#00F59B]/10 text-[#00F59B] border-[#00F59B]/20'
                  : data.dataState === 'LOW_DATA'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : 'bg-white/5 text-gray-400 border-white/10'
              }`}>
                {data.dataState} DATA
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            Trading Behavioral Analytics
          </h1>

          <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Understand observable patterns in your simulated trading history over time.
            Review factual cadence, holding duration, position sizing, volume concentration,
            and study educational lessons to reinforce execution discipline.
          </p>

          {/* Educational Non-Advisory Disclaimer */}
          <div
            className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3 text-xs text-gray-300 font-mono"
            data-testid="analysis-disclaimer"
          >
            <Info className="w-4 h-4 text-[#00D4FF] shrink-0" />
            <span>
              This analysis describes patterns in your simulated trading history. It is educational and is not financial advice or a trading recommendation.
            </span>
          </div>
        </div>
      </div>

      {/* Error Alert with Retry */}
      {error && (
        <div
          className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 flex items-center justify-between gap-4 text-xs sm:text-sm text-rose-200"
          data-testid="analysis-error"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={fetchAnalysis}
            className="px-3.5 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
            data-testid="retry-btn"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      )}

      {/* 2. SECTION 2 — HISTORY SNAPSHOT (Factual Historical Metrics) */}
      <div className="space-y-4" data-testid="history-snapshot-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-[#00F59B]" />
            <span>Section 2 — Historical Trading Snapshot</span>
          </div>
          {data?.analyzedAt && (
            <span className="text-[11px] text-gray-500 font-mono">
              Evaluated {new Date(data.analyzedAt).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" data-testid="metrics-grid">
          {/* Total Trades */}
          <div className="p-5 rounded-2xl bg-[#050a0f] border border-white/[0.07] space-y-2">
            <span className="text-xs text-gray-400 uppercase tracking-wider block">
              Total Simulated Trades
            </span>
            {loading ? (
              <Skeleton className="h-8 w-16 rounded-lg" />
            ) : (
              <div className="text-2xl font-extrabold text-white font-mono" data-testid="metric-total-trades">
                {metrics.totalTrades}
              </div>
            )}
            <p className="text-[11px] text-gray-500">Historical paper orders executed</p>
          </div>

          {/* Buy Trades */}
          <div className="p-5 rounded-2xl bg-[#050a0f] border border-white/[0.07] space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider">
              <span>Buy Orders</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#00F59B]" />
            </div>
            {loading ? (
              <Skeleton className="h-8 w-16 rounded-lg" />
            ) : (
              <div className="text-2xl font-extrabold text-[#00F59B] font-mono" data-testid="metric-buy-trades">
                {metrics.buyTrades}
              </div>
            )}
            <p className="text-[11px] text-gray-500">Position entries or additions</p>
          </div>

          {/* Sell Trades */}
          <div className="p-5 rounded-2xl bg-[#050a0f] border border-white/[0.07] space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider">
              <span>Sell Orders</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-rose-400" />
            </div>
            {loading ? (
              <Skeleton className="h-8 w-16 rounded-lg" />
            ) : (
              <div className="text-2xl font-extrabold text-rose-400 font-mono" data-testid="metric-sell-trades">
                {metrics.sellTrades}
              </div>
            )}
            <p className="text-[11px] text-gray-500">Position reductions or exits</p>
          </div>

          {/* Assets Traded */}
          <div className="p-5 rounded-2xl bg-[#050a0f] border border-white/[0.07] space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-400 uppercase tracking-wider">
              <span>Assets Traded</span>
              <Layers className="w-3.5 h-3.5 text-[#00D4FF]" />
            </div>
            {loading ? (
              <Skeleton className="h-8 w-16 rounded-lg" />
            ) : (
              <div className="text-2xl font-extrabold text-[#00D4FF] font-mono" data-testid="metric-unique-assets">
                {metrics.uniqueAssets}
              </div>
            )}
            <p className="text-[11px] text-gray-500">Distinct crypto symbols simulated</p>
          </div>
        </div>
      </div>

      {/* 3. PHASE 23: ADVANCED BEHAVIORAL ANALYTICS SECTIONS (Rendered when trades exist) */}
      {!loading && totalTrades > 0 && behavioral && (
        <div className="space-y-8" data-testid="behavioral-overview-section">
          {/* Section 2: Trading Cadence & Timing */}
          <div className="space-y-4" data-testid="behavioral-cadence-section">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Timer className="w-4 h-4 text-[#00F59B]" />
                <span>Section 2 — Trading Cadence &amp; Execution Timing</span>
              </div>
              <span className="text-[11px] text-gray-500 font-mono">
                Trading Span: {behavioral.cadence.tradingSpanDays} active day{behavioral.cadence.tradingSpanDays === 1 ? '' : 's'}
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Trades Per Day */}
              <div className="p-5 rounded-2xl bg-[#050a0f] border border-white/[0.07] space-y-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider block">Trades / Day</span>
                <div className="text-xl font-extrabold text-white font-mono" data-testid="metric-trades-per-day">
                  {behavioral.cadence.tradesPerDay}
                </div>
                <p className="text-[11px] text-gray-500">~{behavioral.cadence.tradesPerWeek} trades / week</p>
              </div>

              {/* Average Interval */}
              <div className="p-5 rounded-2xl bg-[#050a0f] border border-white/[0.07] space-y-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider block">Avg Interval</span>
                <div className="text-xl font-extrabold text-[#00D4FF] font-mono" data-testid="metric-average-interval">
                  {formatDurationMinutes(behavioral.cadence.averageIntervalMinutes)}
                </div>
                <p className="text-[11px] text-gray-500">Median: {formatDurationMinutes(behavioral.cadence.medianIntervalMinutes)}</p>
              </div>

              {/* Holding Duration (FIFO) */}
              <div className="p-5 rounded-2xl bg-[#050a0f] border border-white/[0.07] space-y-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider block">Avg Holding Duration</span>
                <div className="text-xl font-extrabold text-[#00F59B] font-mono" data-testid="metric-holding-duration">
                  {formatDurationMinutes(behavioral.holdingDuration.averageHoldingDurationMinutes)}
                </div>
                <p className="text-[11px] text-gray-500">
                  {behavioral.holdingDuration.closedPositionsCount} matched liquidation{behavioral.holdingDuration.closedPositionsCount === 1 ? '' : 's'}
                </p>
              </div>

              {/* Rapid Activity Windows */}
              <div className="p-5 rounded-2xl bg-[#050a0f] border border-white/[0.07] space-y-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider block">Rapid Activity Windows</span>
                <div className="text-xl font-extrabold text-amber-400 font-mono" data-testid="metric-rapid-windows">
                  {behavioral.cadence.rapidActivityWindowsCount}
                </div>
                <p className="text-[11px] text-gray-500">&ge; 3 trades within 30 min</p>
              </div>
            </div>
          </div>

          {/* Section 3: Position Sizing Distribution */}
          <div className="space-y-4" data-testid="position-sizing-section">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <BarChart3 className="w-4 h-4 text-[#00D4FF]" />
                <span>Section 3 — Position-Size Distribution</span>
              </div>
              <span className="text-[11px] text-gray-500 font-mono">
                Avg: {behavioral.positionSizing.averagePositionSize} · Max: {behavioral.positionSizing.largestPositionSize}
              </span>
            </div>

            <div className="p-6 rounded-3xl bg-[#050a0f] border border-white/[0.07] space-y-4 shadow-xl">
              <div className="space-y-3">
                {behavioral.positionSizing.distribution.map((bracket) => (
                  <div key={bracket.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-gray-300 font-semibold">{bracket.label}</span>
                      <span className="text-gray-400">
                        {bracket.count} trade{bracket.count === 1 ? '' : 's'} ({bracket.percentage}%) · {bracket.volumeUSD}
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#00D4FF] to-[#00F59B] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, Math.max(bracket.percentage, bracket.count > 0 ? 3 : 0))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Concentration, Asset Switching & Repeated Patterns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="concentration-switching-section">
            {/* Top Asset & Volume Concentration */}
            <div className="p-6 rounded-3xl bg-[#050a0f] border border-white/[0.07] space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <PieChart className="w-4 h-4 text-[#00F59B]" />
                  <span>Gross Volume Concentration</span>
                </div>
                <span className="text-xs font-bold text-[#00F59B] font-mono" data-testid="metric-top-asset-ratio">
                  Top: {behavioral.concentration.topAssetRatio}%
                </span>
              </div>

              <p className="text-xs text-gray-400">
                Measures historical gross simulated volume concentration, distinct from current portfolio allocation.
              </p>

              <div className="space-y-2 pt-1">
                {behavioral.concentration.assetBreakdown.slice(0, 4).map((item) => (
                  <div key={item.symbol} className="flex items-center justify-between text-xs font-mono p-2 rounded-xl bg-white/[0.02]">
                    <span className="text-white font-bold">{item.symbol}</span>
                    <span className="text-gray-400">{item.volumeUSD} ({item.volumePercentage}%)</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset Switching & Repeated Sequences */}
            <div className="p-6 rounded-3xl bg-[#050a0f] border border-white/[0.07] space-y-4 shadow-xl" data-testid="repeated-patterns-section">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <Shuffle className="w-4 h-4 text-[#00D4FF]" />
                  <span>Asset Switching &amp; Sequences</span>
                </div>
                <span className="text-xs font-bold text-[#00D4FF] font-mono" data-testid="metric-asset-switching">
                  {behavioral.orderDistribution.assetSwitchingPercentage}% switching
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] flex items-center justify-between">
                  <span className="text-gray-400">Consecutive Symbol Switches</span>
                  <span className="text-white font-bold">{behavioral.orderDistribution.assetSwitchingCount} times</span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] flex items-center justify-between">
                  <span className="text-gray-400">Max Consecutive Same-Asset BUY Streak</span>
                  <span className="text-white font-bold">{behavioral.repeatedPatterns.maxConsecutiveBuys}</span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] flex items-center justify-between">
                  <span className="text-gray-400">Max Consecutive Same-Asset SELL Streak</span>
                  <span className="text-white font-bold">{behavioral.repeatedPatterns.maxConsecutiveSells}</span>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] flex items-center justify-between">
                  <span className="text-gray-400">Repeated BUY Sequences (&ge;2 buys)</span>
                  <span className="text-white font-bold">{behavioral.repeatedPatterns.repeatedBuySequencesCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Factual Historical Period Comparison */}
          <div className="space-y-4" data-testid="period-comparison-section">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                <Split className="w-4 h-4 text-purple-400" />
                <span>Section 5 — Historical Period Comparison</span>
              </div>
              <span className="text-[11px] text-gray-500 font-mono">
                {behavioral.periodComparison.hasComparison ? 'Earlier Trades vs Later Trades' : 'Requires 4+ Trades'}
              </span>
            </div>

            {behavioral.periodComparison.hasComparison ? (
              <div className="p-6 rounded-3xl bg-[#050a0f] border border-white/[0.07] space-y-4 shadow-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-2">
                  {/* Earlier Half */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2 font-mono text-xs">
                    <div className="text-gray-400 font-bold uppercase tracking-wider">Earlier Period ({behavioral.periodComparison.earlierPeriod.tradeCount} trades)</div>
                    <div className="text-gray-300">Avg Interval: <span className="text-white font-bold">{behavioral.periodComparison.earlierPeriod.averageIntervalMinutes} min</span></div>
                    <div className="text-gray-300">Avg Trade Size: <span className="text-white font-bold">{behavioral.periodComparison.earlierPeriod.averagePositionSize}</span></div>
                    <div className="text-gray-300">Asset Switching: <span className="text-white font-bold">{behavioral.periodComparison.earlierPeriod.assetSwitchingPercentage}%</span></div>
                    <div className="text-gray-300">Top Asset Ratio: <span className="text-white font-bold">{behavioral.periodComparison.earlierPeriod.topAssetRatio}%</span></div>
                  </div>

                  {/* Later Half */}
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-2 font-mono text-xs">
                    <div className="text-gray-400 font-bold uppercase tracking-wider">Later Period ({behavioral.periodComparison.laterPeriod.tradeCount} trades)</div>
                    <div className="text-gray-300">Avg Interval: <span className="text-white font-bold">{behavioral.periodComparison.laterPeriod.averageIntervalMinutes} min</span></div>
                    <div className="text-gray-300">Avg Trade Size: <span className="text-white font-bold">{behavioral.periodComparison.laterPeriod.averagePositionSize}</span></div>
                    <div className="text-gray-300">Asset Switching: <span className="text-white font-bold">{behavioral.periodComparison.laterPeriod.assetSwitchingPercentage}%</span></div>
                    <div className="text-gray-300">Top Asset Ratio: <span className="text-white font-bold">{behavioral.periodComparison.laterPeriod.topAssetRatio}%</span></div>
                  </div>
                </div>

                {/* Factual Observation Bullets */}
                <div className="pt-2 border-t border-white/[0.06] space-y-1.5 font-mono text-xs text-gray-300">
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">Factual Period Deltas:</div>
                  <ul className="space-y-1 list-disc pl-4 text-gray-400">
                    {behavioral.periodComparison.facts.map((fact, idx) => (
                      <li key={idx} className="leading-relaxed">{fact}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-gray-400 font-mono">
                {behavioral.periodComparison.reason || 'At least 4 executed trades are required for period comparison.'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. SECTION 6 — EDUCATIONAL OBSERVATIONS */}
      <div className="space-y-4" data-testid="observations-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-[#00D4FF]" />
            <span>Section 6 — Mistake Analyzer &amp; Educational Observations</span>
          </div>
          {!loading && totalTrades > 0 && (
            <span className="text-xs text-gray-500 font-mono">
              {observations.length} pattern{observations.length === 1 ? '' : 's'} identified
            </span>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4" data-testid="observations-loading">
            {[1, 2].map((idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-[#050a0f] border border-white/[0.07] space-y-4 shadow-xl"
              >
                <div className="flex justify-between items-center">
                  <Skeleton className="h-5 w-32 rounded-md" />
                  <Skeleton className="h-5 w-20 rounded-md" />
                </div>
                <Skeleton className="h-6 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-16 w-full rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State: Zero historical trades */}
        {!loading && totalTrades === 0 && (
          <div
            className="p-10 text-center rounded-3xl bg-[#050a0f] border border-white/[0.08] space-y-4 shadow-xl"
            data-testid="empty-history-state"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-gray-400 flex items-center justify-center mx-auto">
              <Clock className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Not Enough Trading History Yet</h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                Complete some simulated trades to unlock educational pattern analysis.
                The analyzer studies historical executions to identify areas for discipline and sizing improvement.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/markets"
                data-testid="explore-markets-btn"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F59B] text-black font-semibold text-xs transition-colors hover:bg-[#00F59B]/90 shadow-[0_0_15px_rgba(0,245,155,0.2)]"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Explore Simulated Markets</span>
              </Link>
              <Link
                to="/learn"
                data-testid="learn-first-btn"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-colors"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Learn First</span>
              </Link>
            </div>
          </div>
        )}

        {/* Low-Data Informational Banner (1-2 trades) */}
        {!loading && totalTrades > 0 && totalTrades < 3 && (
          <div
            className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3 text-xs text-gray-300 font-mono"
            data-testid="low-data-notice"
          >
            <Info className="w-4 h-4 text-[#00D4FF] shrink-0" />
            <span>
              Your current history is limited ({totalTrades} trade{totalTrades === 1 ? '' : 's'}), so multi-trade patterns like concentration cannot be fully evaluated yet. More simulated trading history will provide more useful educational observations.
            </span>
          </div>
        )}

        {/* No-Detection State: User has trades, but no defined rule triggered */}
        {!loading && totalTrades >= 3 && observations.length === 0 && (
          <div
            className="p-10 text-center rounded-3xl bg-[#050a0f] border border-white/[0.08] space-y-4 shadow-xl"
            data-testid="no-detection-state"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6 text-[#00F59B]" />
            </div>
            <div className="space-y-2 max-w-lg mx-auto">
              <h3 className="text-base font-bold text-white">
                No Notable Patterns Detected by Current Educational Rules
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                This does not mean every trading decision was ideal. It simply means the current rule set did not identify one of its predefined patterns (such as overtrading, rapid churn, heavy volume concentration, oversized position entry, or potential FOMO-style behavior).
              </p>
              <p className="text-xs text-gray-500 font-mono">
                Continue practicing simulated trading and reviewing lessons to reinforce structured habits.
              </p>
            </div>
            <Link
              to="/learn"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/10 text-white font-semibold text-xs border border-white/10 transition-colors"
            >
              <BookOpen className="w-4 h-4 text-[#00D4FF]" />
              <span>Browse All Learning Lessons</span>
            </Link>
          </div>
        )}

        {/* Detected Observations Cards */}
        {!loading && observations.length > 0 && (
          <div className="space-y-5" data-testid="observations-grid">
            {observations.map((obs) => {
              const categoryStyling =
                CATEGORY_COLORS[obs.category] || {
                  badgeBg: 'bg-white/[0.05]',
                  badgeText: 'text-gray-300',
                  border: 'border-white/[0.08]',
                };

              return (
                <div
                  key={obs.id}
                  data-testid={`observation-card-${obs.id}`}
                  className={`p-6 sm:p-7 rounded-3xl bg-[#050a0f] border ${categoryStyling.border} shadow-2xl space-y-5 transition-all`}
                >
                  {/* Card Header: Category badge, Severity badge, and Title */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      {/* Category Badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide ${categoryStyling.badgeBg} ${categoryStyling.badgeText}`}
                        data-testid={`obs-category-${obs.id}`}
                      >
                        {obs.category}
                      </span>

                      {/* Severity Badge */}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-wider ${
                          obs.severity === 'REVIEW'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-[#00D4FF]/15 text-[#00D4FF] border border-[#00D4FF]/30'
                        }`}
                        data-testid={`obs-severity-${obs.id}`}
                      >
                        {obs.severity}
                      </span>
                    </div>

                    <span className="text-xs text-gray-500 font-mono">
                      Educational Rule #{obs.id}
                    </span>
                  </div>

                  {/* Title & Summary */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-white font-display" data-testid={`obs-title-${obs.id}`}>
                      {obs.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed" data-testid={`obs-summary-${obs.id}`}>
                      {obs.summary}
                    </p>
                  </div>

                  {/* Supporting Factual Evidence Box */}
                  <div
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-1.5 font-mono text-xs text-gray-300"
                    data-testid={`obs-evidence-${obs.id}`}
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#00F59B]" />
                      <span>Factual Trade Evidence</span>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-200">
                      {obs.evidence?.description || JSON.stringify(obs.evidence)}
                    </p>
                  </div>

                  {/* Educational Explanation: "Why It Matters Educationally" */}
                  <div
                    className="p-4 rounded-2xl bg-slate-900/40 border border-white/[0.05] space-y-1.5 text-xs text-gray-300"
                    data-testid={`obs-explanation-${obs.id}`}
                  >
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#00D4FF] flex items-center gap-1.5 font-mono">
                      <Info className="w-3.5 h-3.5 text-[#00D4FF]" />
                      <span>Why This Matters Educationally</span>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-300">
                      {obs.explanation}
                    </p>
                  </div>

                  {/* Card Footer: Review Mapped Lesson CTA */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="text-xs text-gray-400 font-mono flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span>Recommended Lesson:</span>
                      <span className="text-gray-200 font-semibold">{obs.lessonTitle || obs.lessonId}</span>
                    </div>

                    <Link
                      to={`/learn/${obs.lessonId}`}
                      data-testid={`review-lesson-btn-${obs.id}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold border border-white/10 transition-all shadow-sm"
                    >
                      <span>Review Lesson</span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#00F59B]" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Educational Sandbox Footer Disclaimer */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-[11px] text-gray-500 font-mono">
        <div>
          EDUCATIONAL BEHAVIORAL ANALYTICS · Descriptive historical patterns and discipline metrics.
          Zero financial advice, zero market predictions, zero trader performance grading.
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
