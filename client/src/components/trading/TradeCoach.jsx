import React, { useState, useEffect, useRef } from 'react';
import {
  Compass,
  TrendingUp,
  TrendingDown,
  PieChart,
  ShieldAlert,
  ShieldCheck,
  Lightbulb,
  AlertTriangle,
  RefreshCw,
  Info,
} from 'lucide-react';
import { analyzeTrade } from '../../services/tradeCoachService';
import { formatPrice } from '../../utils/marketFormatters';

/**
 * Visual badge styling helper for deterministic exposure levels
 */
function getLevelBadgeStyle(level) {
  switch (level) {
    case 'LOW':
      return {
        bg: 'bg-[#00F59B]/10',
        text: 'text-[#00F59B]',
        border: 'border-[#00F59B]/30',
        bar: 'bg-[#00F59B]',
      };
    case 'MODERATE':
      return {
        bg: 'bg-[#00D4FF]/10',
        text: 'text-[#00D4FF]',
        border: 'border-[#00D4FF]/30',
        bar: 'bg-[#00D4FF]',
      };
    case 'HIGH':
      return {
        bg: 'bg-[#F59E0B]/10',
        text: 'text-[#F59E0B]',
        border: 'border-[#F59E0B]/30',
        bar: 'bg-[#F59E0B]',
      };
    case 'VERY_HIGH':
      return {
        bg: 'bg-[#EF4444]/10',
        text: 'text-[#EF4444]',
        border: 'border-[#EF4444]/30',
        bar: 'bg-[#EF4444]',
      };
    default:
      return {
        bg: 'bg-white/10',
        text: 'text-gray-300',
        border: 'border-white/20',
        bar: 'bg-gray-400',
      };
  }
}

const TradeCoach = ({ symbol, side = 'BUY', quantity = '' }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abortControllerRef = useRef(null);

  // Validate if quantity is a plausible positive number before requesting analysis
  const numericQty = parseFloat(quantity);
  const hasValidQuantity =
    quantity &&
    !isNaN(numericQty) &&
    isFinite(numericQty) &&
    numericQty > 0 &&
    /^\d+(\.\d{1,8})?$/.test(String(quantity).trim());

  useEffect(() => {
    // 1. Cancel any active pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    // 2. If input is empty or invalid, clear analysis immediately
    if (!symbol || !hasValidQuantity) {
      setAnalysis(null);
      setLoading(false);
      setError(null);
      return;
    }

    // 3. Debounce API call (350ms) to avoid hammering backend during typing
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await analyzeTrade(
          {
            symbol,
            side,
            quantity,
          },
          controller.signal
        );

        if (res && res.success && res.data) {
          setAnalysis(res.data);
          setError(null);
        } else {
          throw new Error(res?.message || 'Could not retrieve trade analysis.');
        }
      } catch (err) {
        if (err.name === 'AbortError' || err.name === 'CanceledError') {
          // Request was aborted by newer input; do not update state
          return;
        }
        console.warn('[TradeCoach] Analysis request failed:', err.message);
        setError(err.message || 'Trade Coach analysis is temporarily unavailable.');
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [symbol, side, quantity, hasValidQuantity]);

  // Retry handler
  const handleRetry = () => {
    if (symbol && hasValidQuantity) {
      setLoading(true);
      setError(null);
      analyzeTrade({ symbol, side, quantity })
        .then((res) => {
          if (res?.success && res.data) {
            setAnalysis(res.data);
          }
        })
        .catch((err) => {
          setError(err.message || 'Trade Coach analysis is temporarily unavailable.');
        })
        .finally(() => setLoading(false));
    }
  };

  const isBuy = side === 'BUY';

  // -------------------------------------------------------------
  // STATE 1: IDLE / EMPTY QUANTITY
  // -------------------------------------------------------------
  if (!hasValidQuantity) {
    return (
      <div
        data-testid="trade-coach-idle"
        className="p-5 rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] backdrop-blur-md space-y-3"
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B]">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
                <span>Trade Coach</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 font-semibold">
                  EDUCATIONAL
                </span>
              </h3>
              <p className="text-[11px] text-gray-400 font-mono">
                Understand the implications of your simulated trade
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-xs font-mono text-gray-400 flex items-start gap-3">
          <Info className="w-4 h-4 text-[#00D4FF] shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            Enter an order quantity above to view real-time educational insights on position
            sizing, cash allocation, portfolio concentration, and simulated risk exposure.
          </p>
        </div>

        <div className="text-[10px] font-mono text-gray-500 flex items-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B] shrink-0" />
          <span>Educational simulation tool · Never provides financial advice</span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 2: LOADING SKELETON
  // -------------------------------------------------------------
  if (loading && !analysis) {
    return (
      <div
        data-testid="trade-coach-loading"
        className="p-5 rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] backdrop-blur-md space-y-4 animate-pulse"
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-gray-400">
              <Compass className="w-4 h-4 animate-spin" />
            </div>
            <div>
              <div className="h-4 w-28 bg-white/10 rounded" />
              <div className="h-3 w-40 bg-white/5 rounded mt-1.5" />
            </div>
          </div>
          <span className="text-[10px] font-mono text-gray-400">Analyzing trade...</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 bg-white/[0.03] border border-white/[0.05] rounded-xl" />
          <div className="h-20 bg-white/[0.03] border border-white/[0.05] rounded-xl" />
          <div className="h-20 bg-white/[0.03] border border-white/[0.05] rounded-xl" />
          <div className="h-20 bg-white/[0.03] border border-white/[0.05] rounded-xl" />
        </div>

        <div className="h-24 bg-white/[0.03] border border-white/[0.05] rounded-xl" />
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 3: ERROR STATE
  // -------------------------------------------------------------
  if (error && !analysis) {
    return (
      <div
        data-testid="trade-coach-error"
        className="p-5 rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] backdrop-blur-md space-y-3"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444]">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-sans">Trade Coach Unavailable</h3>
            <p className="text-[11px] text-gray-400 font-mono">
              Trade Coach couldn't analyze this simulated trade right now.
            </p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs font-mono text-gray-400 space-y-1">
          <p className="text-[11px] text-gray-300">
            {error || 'Market data is temporarily unreachable.'}
          </p>
          <p className="text-[10px] text-gray-500">
            Your simulated wallet and holdings have not been changed. You can still practice trading
            normally with the order panel above.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-xs font-mono font-semibold transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Analysis</span>
        </button>
      </div>
    );
  }

  // -------------------------------------------------------------
  // STATE 4: ACTIVE ANALYSIS
  // -------------------------------------------------------------
  const { analysis: metrics, trade, education = [], disclaimer } = analysis || {};
  const posStyle = getLevelBadgeStyle(metrics?.positionSize?.level);
  const concStyle = getLevelBadgeStyle(metrics?.concentration?.level);
  const riskStyle = getLevelBadgeStyle(metrics?.riskExposure?.level);

  return (
    <div
      data-testid="trade-coach-panel"
      className="p-5 rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] backdrop-blur-md space-y-5"
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B] shadow-[0_0_15px_rgba(0,245,155,0.15)]">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-sans flex items-center gap-2">
              <span>Trade Coach</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/20 font-semibold">
                LIVE ANALYSIS
              </span>
            </h3>
            <p className="text-[11px] text-gray-400 font-mono">
              Understand this simulated {side.toLowerCase()} order
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono text-gray-500">
          {loading ? 'Refreshing...' : 'Deterministic'}
        </span>
      </div>

      {/* 4 Core Metric Cards Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* CARD 1: POSITION SIZE */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-gray-400 font-semibold">Position Size</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}
            >
              {metrics?.positionSize?.level || 'LOW'}
            </span>
          </div>
          <div className="text-sm font-bold text-white">
            {metrics?.positionSize?.percentage}%
          </div>
          <p className="text-[10px] text-gray-500 leading-tight">
            {isBuy ? 'of available virtual cash' : 'holding reduction'}
          </p>
        </div>

        {/* CARD 2: CASH ALLOCATION / ESTIMATED PROCEEDS */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-gray-400 font-semibold">
              {isBuy ? 'Cash Allocation' : 'Est. Proceeds'}
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${posStyle.bg} ${posStyle.text} ${posStyle.border}`}
            >
              {metrics?.cashAllocation?.level || 'LOW'}
            </span>
          </div>
          <div className="text-sm font-bold text-white">
            {formatPrice(trade?.estimatedValueUSD || 0)}
          </div>
          <p className="text-[10px] text-gray-500 leading-tight">
            {isBuy ? `${metrics?.cashAllocation?.percentage}% of virtual cash` : 'credited to wallet'}
          </p>
        </div>

        {/* CARD 3: HOLDING CONCENTRATION */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-gray-400 font-semibold">Concentration</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${concStyle.bg} ${concStyle.text} ${concStyle.border}`}
            >
              {metrics?.concentration?.level || 'LOW'}
            </span>
          </div>
          <div className="text-sm font-bold text-white">
            {metrics?.concentration?.percentage}%
          </div>
          <p className="text-[10px] text-gray-500 leading-tight">
            of tracked crypto holdings
          </p>
        </div>

        {/* CARD 4: RISK EXPOSURE */}
        <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-gray-400 font-semibold">Risk Exposure</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${riskStyle.bg} ${riskStyle.text} ${riskStyle.border}`}
            >
              {metrics?.riskExposure?.level || 'LOW'}
            </span>
          </div>
          <div className={`text-xs font-bold ${riskStyle.text}`}>
            {metrics?.riskExposure?.level || 'LOW'} EXPOSURE
          </div>
          <p className="text-[10px] text-gray-500 leading-tight">
            Educational classification
          </p>
        </div>
      </div>

      {/* Insufficient Resources Educational Warning Callout */}
      {metrics?.hasInsufficientCash && (
        <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs font-mono text-[#EF4444]">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-bold">Insufficient Virtual Cash:</strong>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              This simulated order requires more virtual cash than your account currently holds.
              Real market orders fail when buying power is insufficient.
            </p>
          </div>
        </div>
      )}

      {metrics?.hasInsufficientHoldings && (
        <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-2.5 text-xs font-mono text-[#EF4444]">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <strong className="font-bold">Insufficient Holdings:</strong>
            <p className="text-[11px] text-gray-300 leading-relaxed">
              You do not own enough {symbol} to execute this sale. Crypto Compass does not allow
              short selling or negative asset balances.
            </p>
          </div>
        </div>
      )}

      {/* Pedagogical Educational Breakdowns */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center gap-1.5 text-xs font-bold font-sans text-white uppercase tracking-wider">
          <Lightbulb className="w-3.5 h-3.5 text-[#00F59B]" />
          <span>Learn & Understand</span>
        </div>

        <div className="space-y-2">
          {education.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1 text-xs font-mono"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-200">{item.title}</span>
                <span className="text-[10px] text-gray-500 uppercase">{item.topic}</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">{item.message}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Safety & Educational Disclaimer Footer */}
      <div className="pt-2 border-t border-white/[0.06] flex items-start gap-2 text-[10px] font-mono text-gray-500">
        <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-gray-400">EDUCATIONAL SIMULATION ONLY: </strong>
          {disclaimer ||
            'Not financial advice. This analysis measures simulated account exposure and does not predict future market prices.'}
        </p>
      </div>
    </div>
  );
};

export default TradeCoach;
