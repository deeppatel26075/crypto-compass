import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  RefreshCw,
  AlertCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Layers,
  Coins,
  DollarSign,
  Info,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  LogOut,
} from 'lucide-react';
import { getPortfolio } from '../services/portfolioService';
import { executeOrder } from '../services/tradingService';
import Skeleton from '../components/ui/Skeleton';
import ExitTradeModal from '../components/portfolio/ExitTradeModal';

// Distinct asset color mapping for allocation bar
const ASSET_COLORS = {
  BTC: '#F7931A',
  ETH: '#627EEA',
  SOL: '#14F195',
  BNB: '#F3BA2F',
  XRP: '#23292F',
  ADA: '#0033AD',
  DOGE: '#C2A633',
  AVAX: '#E84142',
  DOT: '#E6007A',
  LINK: '#375BD2',
};

const DEFAULT_CRYPTO_COLORS = ['#00D4FF', '#A855F7', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'];

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Exit Trade Modal state
  const [selectedHoldingForExit, setSelectedHoldingForExit] = useState(null);
  const [isExitModalOpen, setIsExitModalOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [exitExecutionResult, setExitExecutionResult] = useState(null);
  const [exitExecutionError, setExitExecutionError] = useState(null);

  const fetchPortfolioData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);

      const res = await getPortfolio();
      if (res && res.data) {
        setPortfolio(res.data);
        setError(null);
      } else {
        throw new Error('No portfolio data returned from server.');
      }
    } catch (err) {
      setError(err.message || 'Unable to load your portfolio right now.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPortfolioData();
  }, [fetchPortfolioData]);

  // Derived color mapping for active holdings in allocation visualization
  const assetColorMap = useMemo(() => {
    if (!portfolio?.holdings) return {};
    const map = {};
    let fallbackIdx = 0;
    portfolio.holdings.forEach((h) => {
      const sym = h.symbol.toUpperCase();
      if (ASSET_COLORS[sym]) {
        map[sym] = ASSET_COLORS[sym];
      } else {
        map[sym] = DEFAULT_CRYPTO_COLORS[fallbackIdx % DEFAULT_CRYPTO_COLORS.length];
        fallbackIdx++;
      }
    });
    return map;
  }, [portfolio?.holdings]);

  // Handle opening Exit Modal
  const handleOpenExitModal = (holding) => {
    setSelectedHoldingForExit(holding);
    setExitExecutionResult(null);
    setExitExecutionError(null);
    setIsExitModalOpen(true);
  };

  const handleCloseExitModal = () => {
    if (!isExiting) {
      setIsExitModalOpen(false);
      setSelectedHoldingForExit(null);
      setExitExecutionResult(null);
      setExitExecutionError(null);
    }
  };

  // Handle confirming exit order
  const handleConfirmExit = async (holding) => {
    if (!holding || isExiting) return;

    try {
      setIsExiting(true);
      setExitExecutionError(null);

      // Generate a unique client idempotency key for this exit action
      const idempotencyKey = `exit-${holding.symbol.toLowerCase()}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      // Execute normal SELL order through Phase 9 trading engine
      const res = await executeOrder({
        symbol: holding.symbol,
        side: 'SELL',
        quantity: holding.quantity,
        orderType: 'MARKET',
        idempotencyKey,
      });

      if (res && res.data) {
        setExitExecutionResult(res.data);
        // Refresh portfolio immediately to reflect holding removal and new cash balance
        fetchPortfolioData(true);
      } else {
        throw new Error(res?.message || 'Exit trade failed to execute.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Exit trade failed.';
      setExitExecutionError(msg);
      // Auto refresh on error to ensure accurate state
      fetchPortfolioData(true);
    } finally {
      setIsExiting(false);
    }
  };

  const handleContinueAfterExit = () => {
    handleCloseExitModal();
    fetchPortfolioData(true);
  };

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true" aria-live="polite">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48 rounded-lg bg-white/[0.05]" />
            <Skeleton className="h-4 w-72 rounded bg-white/[0.03]" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl bg-white/[0.05]" />
        </div>

        {/* Top Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] space-y-3">
              <Skeleton className="h-4 w-28 rounded bg-white/[0.04]" />
              <Skeleton className="h-8 w-40 rounded-lg bg-white/[0.06]" />
              <Skeleton className="h-3 w-32 rounded bg-white/[0.03]" />
            </div>
          ))}
        </div>

        {/* Allocation Bar Skeleton */}
        <div className="p-5 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] space-y-4">
          <Skeleton className="h-5 w-44 rounded bg-white/[0.05]" />
          <Skeleton className="h-5 w-full rounded-full bg-white/[0.04]" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-24 rounded bg-white/[0.03]" />
            <Skeleton className="h-4 w-24 rounded bg-white/[0.03]" />
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="p-5 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] space-y-4">
          <Skeleton className="h-5 w-36 rounded bg-white/[0.05]" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-14 w-full rounded-xl bg-white/[0.03]" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error State
  if (error || !portfolio) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] mb-4 shadow-[0_0_25px_rgba(239,68,68,0.2)]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Unable to load your portfolio right now.</h2>
        <p className="text-sm text-gray-400 max-w-md mb-6">
          {error || 'A temporary communication error occurred while loading your simulated holdings.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => fetchPortfolioData(true)}
            className="px-5 py-2.5 rounded-xl bg-[#00F59B] text-black font-semibold text-xs hover:bg-[#00F59B]/90 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
          <Link
            to="/markets"
            className="px-5 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-gray-300 font-semibold text-xs hover:bg-white/[0.08] transition-colors"
          >
            Explore Markets
          </Link>
        </div>
      </div>
    );
  }

  const {
    cash,
    cryptoValue,
    cryptoAllocationPercent,
    totalPortfolioValue,
    totalProfitLoss,
    totalProfitLossPercentage,
    totalCostBasis,
    isTotalValuePartial,
    isMarketDataStale,
    holdingsCount,
    holdings = [],
  } = portfolio;

  const hasHoldings = holdingsCount > 0 && holdings.length > 0;
  const isTotalProfit = (portfolio.totalProfitLossCents ?? 0) >= 0;

  return (
    <div className="space-y-6 pb-12" data-testid="portfolio-container">
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase font-sans">
              Portfolio
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B]">
              Simulated
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Live Unrealized Positions · Educational Simulation Only · Not Financial Advice
          </p>
        </div>

        <button
          onClick={() => fetchPortfolioData(true)}
          disabled={refreshing}
          aria-label="Refresh portfolio data"
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0a1118] border border-white/10 text-xs font-medium text-gray-300 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#00F59B]' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* 2. Stale or Partial Market Valuation Warnings */}
      {isMarketDataStale && (
        <div
          role="alert"
          className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs"
        >
          <Clock className="w-4 h-4 flex-shrink-0" />
          <span>Market prices are currently delayed. Displayed values and P&L reflect cached market prices.</span>
        </div>
      )}

      {isTotalValuePartial && (
        <div
          role="alert"
          className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs"
        >
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>One or more holdings currently lack live market valuations. Total portfolio valuation and P&L are incomplete.</span>
        </div>
      )}

      {/* 3. Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Simulated Portfolio Value */}
        <div className="p-5 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-2">
            <span>TOTAL VALUE</span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-300">
              Virtual
            </span>
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight mb-1 font-mono">
            {isTotalValuePartial ? 'Incomplete' : (totalPortfolioValue || '$0.00')}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B]" />
            <span>Cash + Active Crypto</span>
          </div>
        </div>

        {/* Virtual Cash */}
        <div className="p-5 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-2">
            <span>VIRTUAL CASH</span>
            {cash?.allocationPercent !== null && cash?.allocationPercent !== undefined && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B]">
                {cash.allocationPercent.toFixed(2)}%
              </span>
            )}
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight mb-1 font-mono">
            {cash?.balance || '$0.00'}
          </div>
          <div className="text-[11px] text-gray-500">
            Available Virtual USD
          </div>
        </div>

        {/* Crypto Holdings Value */}
        <div className="p-5 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-2">
            <span>CRYPTO HOLDINGS</span>
            {cryptoAllocationPercent !== null && cryptoAllocationPercent !== undefined && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[#00D4FF]">
                {cryptoAllocationPercent.toFixed(2)}%
              </span>
            )}
          </div>
          <div className="text-2xl font-extrabold text-white tracking-tight mb-1 font-mono">
            {isTotalValuePartial ? 'Partial' : (cryptoValue || '$0.00')}
          </div>
          <div className="text-[11px] text-gray-500">
            Cost: {totalCostBasis || '$0.00'}
          </div>
        </div>

        {/* Unrealized P&L */}
        <div className="p-5 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] backdrop-blur-xl relative overflow-hidden group">
          <div className="flex items-center justify-between text-xs text-gray-400 font-medium mb-2">
            <span>UNREALIZED P&L</span>
            {totalProfitLossPercentage !== null && totalProfitLossPercentage !== undefined && (
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isTotalProfit
                    ? 'bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B]'
                    : 'bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444]'
                }`}
              >
                {isTotalProfit ? '+' : ''}{totalProfitLossPercentage.toFixed(2)}%
              </span>
            )}
          </div>
          <div
            className={`text-2xl font-extrabold tracking-tight mb-1 font-mono ${
              !hasHoldings || isTotalValuePartial
                ? 'text-gray-400'
                : isTotalProfit
                ? 'text-[#00F59B]'
                : 'text-[#EF4444]'
            }`}
          >
            {isTotalValuePartial
              ? 'Unavailable'
              : !hasHoldings
              ? '$0.00'
              : `${isTotalProfit ? '+' : ''}${totalProfitLoss || '$0.00'}`}
          </div>
          <div className="text-[11px] text-gray-500 flex items-center gap-1">
            {isTotalProfit ? (
              <TrendingUp className="w-3.5 h-3.5 text-[#00F59B]" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-[#EF4444]" />
            )}
            <span>Current open positions only</span>
          </div>
        </div>
      </div>

      {/* 4. Portfolio Allocation Visualization */}
      <div className="p-5 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] backdrop-blur-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00F59B]" />
              <span>Portfolio Allocation</span>
            </h2>
            <p className="text-[11px] text-gray-400">
              Distribution between virtual cash reserves and active cryptocurrency holdings
            </p>
          </div>
          {cash?.allocationPercent !== null && (
            <div className="text-xs font-mono text-gray-400 flex items-center gap-3">
              <span>Cash: <strong className="text-white">{cash.allocationPercent.toFixed(2)}%</strong></span>
              <span>Crypto: <strong className="text-white">{(cryptoAllocationPercent ?? 0).toFixed(2)}%</strong></span>
            </div>
          )}
        </div>

        {/* Horizontal Segmented Allocation Bar */}
        <div
          className="h-4 w-full rounded-full bg-[#050a0f] border border-white/10 flex overflow-hidden p-0.5 gap-0.5"
          role="progressbar"
          aria-label="Portfolio allocation bar"
          aria-valuenow={cash?.allocationPercent ?? 100}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          {/* Cash Segment */}
          <div
            className="h-full rounded-l-full bg-[#00F59B] transition-all duration-500"
            style={{ width: `${Math.max(cash?.allocationPercent ?? 100, 0)}%` }}
            title={`Virtual Cash: ${cash?.allocationPercent?.toFixed(2) ?? 100}%`}
          />
          {/* Individual Crypto Holdings Segments */}
          {holdings.map((h, idx) => {
            const pct = h.portfolioAllocationPercent ?? 0;
            if (pct <= 0) return null;
            const isLast = idx === holdings.length - 1;
            return (
              <div
                key={h.symbol}
                className={`h-full transition-all duration-500 ${isLast ? 'rounded-r-full' : ''}`}
                style={{
                  width: `${pct}%`,
                  backgroundColor: assetColorMap[h.symbol] || '#00D4FF',
                }}
                title={`${h.name} (${h.symbol}): ${pct.toFixed(2)}%`}
              />
            );
          })}
        </div>

        {/* Allocation Legend */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00F59B]" />
            <span className="text-gray-300 font-medium">Virtual Cash</span>
            <span className="text-gray-500 font-mono">
              ({cash?.allocationPercent?.toFixed(2) ?? 100}%)
            </span>
          </div>

          {holdings.map((h) => (
            <div key={h.symbol} className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: assetColorMap[h.symbol] || '#00D4FF' }}
              />
              <span className="text-gray-300 font-medium">{h.symbol}</span>
              <span className="text-gray-500 font-mono">
                ({h.portfolioAllocationPercent !== null ? `${h.portfolioAllocationPercent.toFixed(2)}%` : '—'})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Holdings Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2 font-sans">
            <Coins className="w-4 h-4 text-[#00F59B]" />
            <span>Your Positions & P&L</span>
          </h2>
          <span className="text-xs text-gray-400 font-mono">
            {holdingsCount} {holdingsCount === 1 ? 'holding' : 'holdings'}
          </span>
        </div>

        {/* Empty State */}
        {!hasHoldings ? (
          <div
            data-testid="portfolio-empty-state"
            className="p-8 sm:p-12 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] text-center backdrop-blur-xl flex flex-col items-center justify-center space-y-3"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-400 mb-2">
              <Briefcase className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">Your crypto portfolio is empty</h3>
            <p className="text-xs text-gray-400 max-w-sm">
              Your $10,000 virtual cash balance is ready for simulated practice. Explore available markets to begin paper trading.
            </p>
            <div className="pt-3">
              <Link
                to="/markets"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F59B] text-black font-semibold text-xs hover:bg-[#00F59B]/90 transition-all shadow-[0_0_20px_rgba(0,245,155,0.2)]"
              >
                <span>Explore Markets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table View (md and up) */}
            <div className="hidden md:block rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] backdrop-blur-xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse" data-testid="holdings-table">
                  <thead>
                    <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Asset</th>
                      <th className="py-3.5 px-3 text-right">Quantity</th>
                      <th className="py-3.5 px-3 text-right">Entry Price</th>
                      <th className="py-3.5 px-3 text-right">Market Price</th>
                      <th className="py-3.5 px-3 text-right">Cost Basis</th>
                      <th className="py-3.5 px-3 text-right">Current Value</th>
                      <th className="py-3.5 px-3 text-right">Unrealized P&L</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] text-xs">
                    {holdings.map((h) => {
                      const color = assetColorMap[h.symbol] || '#00D4FF';
                      const isProfit = (h.profitLossCents ?? 0) >= 0;
                      const hasPrice = h.priceAvailable;

                      return (
                        <tr
                          key={h.symbol}
                          className="hover:bg-white/[0.02] transition-colors group"
                          data-testid={`holding-row-${h.symbol.toLowerCase()}`}
                        >
                          {/* Asset Info */}
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              {h.image ? (
                                <img
                                  src={h.image}
                                  alt={h.name}
                                  className="w-8 h-8 rounded-full flex-shrink-0"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div
                                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                                  style={{ backgroundColor: `${color}20`, color }}
                                >
                                  {h.symbol.slice(0, 3)}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-white flex items-center gap-1.5">
                                  <span>{h.name}</span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/[0.06] text-gray-400">
                                    {h.symbol}
                                  </span>
                                </div>
                                <div className="text-[10px] text-gray-500 font-mono">
                                  {h.portfolioAllocationPercent !== null ? `${h.portfolioAllocationPercent.toFixed(1)}% share` : ''}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Quantity */}
                          <td className="py-4 px-3 text-right font-mono font-medium text-gray-200">
                            {h.quantity} <span className="text-gray-500 text-[10px]">{h.symbol}</span>
                          </td>

                          {/* Average Buy Price (Entry) */}
                          <td className="py-4 px-3 text-right font-mono text-gray-300">
                            {h.averageBuyPrice}
                          </td>

                          {/* Current Market Price */}
                          <td className="py-4 px-3 text-right font-mono">
                            {hasPrice ? (
                              <span className="text-white font-medium">{h.currentPrice}</span>
                            ) : (
                              <span className="text-amber-400/80 text-[11px] italic">Unavailable</span>
                            )}
                          </td>

                          {/* Cost Basis */}
                          <td className="py-4 px-3 text-right font-mono text-gray-300">
                            {h.costBasis || '—'}
                          </td>

                          {/* Current Market Value */}
                          <td className="py-4 px-3 text-right font-mono font-bold">
                            {hasPrice ? (
                              <span className="text-white">{h.currentMarketValue}</span>
                            ) : (
                              <span className="text-amber-400/80 text-[11px] italic">Unavailable</span>
                            )}
                          </td>

                          {/* Unrealized P&L */}
                          <td className="py-4 px-3 text-right font-mono font-bold">
                            {hasPrice && h.profitLoss !== null ? (
                              <div className={isProfit ? 'text-[#00F59B]' : 'text-[#EF4444]'}>
                                <div>
                                  {isProfit ? '+' : ''}{h.profitLoss}
                                </div>
                                <div className="text-[10px] font-semibold">
                                  {h.profitLossPercentage !== null
                                    ? `${isProfit ? '+' : ''}${h.profitLossPercentage.toFixed(2)}%`
                                    : '—'}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500">—</span>
                            )}
                          </td>

                          {/* Action Buttons: Trade & Exit */}
                          <td className="py-4 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                to={`/markets/${h.symbol.toLowerCase()}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-300 text-xs font-medium transition-all"
                              >
                                <span>Trade</span>
                              </Link>
                              <button
                                onClick={() => handleOpenExitModal(h)}
                                disabled={!h.priceAvailable}
                                title={!h.priceAvailable ? 'Market price unavailable' : 'Exit 100% position'}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#EF4444]/10 hover:bg-[#EF4444]/20 border border-[#EF4444]/30 text-[#EF4444] text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                <LogOut className="w-3 h-3" />
                                <span>Exit</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Stacked Cards View (hidden on md, visible on sm/mobile) */}
            <div className="md:hidden space-y-3" data-testid="holdings-cards-mobile">
              {holdings.map((h) => {
                const color = assetColorMap[h.symbol] || '#00D4FF';
                const isProfit = (h.profitLossCents ?? 0) >= 0;
                const hasPrice = h.priceAvailable;

                return (
                  <div
                    key={h.symbol}
                    className="p-4 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] backdrop-blur-xl space-y-3"
                    data-testid={`holding-card-${h.symbol.toLowerCase()}`}
                  >
                    {/* Header: Asset & Actions */}
                    <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2.5">
                        {h.image ? (
                          <img
                            src={h.image}
                            alt={h.name}
                            className="w-7 h-7 rounded-full flex-shrink-0"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
                            style={{ backgroundColor: `${color}20`, color }}
                          >
                            {h.symbol.slice(0, 3)}
                          </div>
                        )}
                        <div>
                          <div className="font-bold text-sm text-white leading-tight">{h.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono">{h.symbol}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/markets/${h.symbol.toLowerCase()}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/10 text-gray-300 text-xs font-medium"
                        >
                          <span>Trade</span>
                        </Link>
                        <button
                          onClick={() => handleOpenExitModal(h)}
                          disabled={!h.priceAvailable}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-semibold disabled:opacity-40"
                        >
                          <LogOut className="w-3 h-3" />
                          <span>Exit</span>
                        </button>
                      </div>
                    </div>

                    {/* Quantity & Current Value */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Quantity</div>
                        <div className="font-mono font-medium text-white">{h.quantity} {h.symbol}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Current Value</div>
                        <div className="font-mono font-bold text-white">
                          {hasPrice ? h.currentMarketValue : 'Unavailable'}
                        </div>
                      </div>
                    </div>

                    {/* Entry Price & Market Price */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/[0.04]">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Avg Entry Price</div>
                        <div className="font-mono text-gray-200">{h.averageBuyPrice}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Market Price</div>
                        <div className="font-mono text-gray-200">
                          {hasPrice ? h.currentPrice : 'Unavailable'}
                        </div>
                      </div>
                    </div>

                    {/* Cost Basis & Unrealized P&L */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/[0.04]">
                      <div>
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Cost Basis</div>
                        <div className="font-mono text-gray-200">{h.costBasis || '—'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 uppercase font-semibold">Unrealized P&L</div>
                        <div
                          className={`font-mono font-bold ${
                            !hasPrice || h.profitLoss === null
                              ? 'text-gray-400'
                              : isProfit
                              ? 'text-[#00F59B]'
                              : 'text-[#EF4444]'
                          }`}
                        >
                          {hasPrice && h.profitLoss !== null ? (
                            <span>
                              {isProfit ? '+' : ''}{h.profitLoss} ({h.profitLossPercentage !== null ? `${isProfit ? '+' : ''}${h.profitLossPercentage.toFixed(2)}%` : '—'})
                            </span>
                          ) : (
                            '—'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* 6. Educational Disclaimer */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-[11px] text-gray-500 font-mono">
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <Info className="w-3.5 h-3.5 text-gray-400" />
          <strong className="text-gray-400">EDUCATIONAL SIMULATION ONLY</strong>
        </div>
        <div>Educational Simulation Only · Not Financial Advice · Open paper positions only</div>
      </div>

      {/* 7. Exit Trade Confirmation Modal */}
      <ExitTradeModal
        isOpen={isExitModalOpen}
        onClose={handleCloseExitModal}
        holding={selectedHoldingForExit}
        onConfirmExit={handleConfirmExit}
        isSubmitting={isExiting}
        executionResult={exitExecutionResult}
        executionError={exitExecutionError}
        onContinue={handleContinueAfterExit}
      />
    </div>
  );
};

export default PortfolioPage;
