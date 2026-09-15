import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Filter,
  Layers,
  Info,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import { getHistory } from '../services/historyService';
import Skeleton from '../components/ui/Skeleton';

const SIDES = [
  { id: 'ALL', label: 'All Trades' },
  { id: 'BUY', label: 'Buy Orders' },
  { id: 'SELL', label: 'Sell Orders' },
];

/**
 * Format ISO date string into standard clean date/time (e.g. "14 Sep 2026 · 10:42 AM")
 */
function formatDateTime(isoString) {
  if (!isoString) return '—';
  try {
    const d = new Date(isoString);
    const day = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    return `${day} · ${time}`;
  } catch {
    return String(isoString);
  }
}

const TradingHistoryPage = () => {
  const [trades, setTrades] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [sideFilter, setSideFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = useCallback(
    async (pageToFetch = pagination.page, sideToFetch = sideFilter, isManual = false) => {
      try {
        if (isManual) setRefreshing(true);
        else setLoading(true);

        const res = await getHistory({
          page: pageToFetch,
          limit: 20,
          side: sideToFetch,
          sortBy: 'newest',
        });

        if (res && res.data) {
          setTrades(res.data.trades || []);
          setPagination(res.data.pagination || {});
          setError(null);
        } else {
          throw new Error('No trade data returned from server.');
        }
      } catch (err) {
        setError(err.message || 'Unable to load your trading history right now.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [pagination.page, sideFilter]
  );

  useEffect(() => {
    fetchHistory(pagination.page, sideFilter);
  }, [fetchHistory, pagination.page, sideFilter]);

  const handleSideChange = (newSide) => {
    if (newSide !== sideFilter) {
      setSideFilter(newSide);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= (pagination.totalPages || 1)) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Loading Skeleton View
  if (loading) {
    return (
      <div className="space-y-6 animate-pulse" aria-busy="true" aria-live="polite">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56 rounded-lg bg-white/[0.05]" />
            <Skeleton className="h-4 w-72 rounded bg-white/[0.03]" />
          </div>
          <Skeleton className="h-10 w-28 rounded-xl bg-white/[0.05]" />
        </div>

        {/* Filter Chips Skeleton */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-9 w-24 rounded-xl bg-white/[0.04]" />
          ))}
        </div>

        {/* Table Skeleton */}
        <div className="p-5 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] space-y-3">
          <Skeleton className="h-6 w-36 rounded bg-white/[0.05]" />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl bg-white/[0.03]" />
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
        <h2 className="text-xl font-bold text-white mb-2">Unable to load your trading history right now.</h2>
        <p className="text-sm text-gray-400 max-w-md mb-6">
          {error || 'A temporary communication error occurred while reading your historical simulated trades.'}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => fetchHistory(pagination.page, sideFilter, true)}
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

  const hasTrades = trades && trades.length > 0;
  const isGlobalEmpty = pagination.total === 0 && sideFilter === 'ALL';

  return (
    <div className="space-y-6 pb-12" data-testid="history-container">
      {/* 1. Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-white uppercase font-sans">
              Trading History
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B]">
              Audit Log
            </span>
          </div>
          <p className="text-xs text-gray-400">
            Historical simulated orders and realized P&L · Educational Simulation Only
          </p>
        </div>

        <button
          onClick={() => fetchHistory(pagination.page, sideFilter, true)}
          disabled={refreshing}
          aria-label="Refresh trading history"
          className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0a1118] border border-white/10 text-xs font-medium text-gray-300 hover:text-white hover:border-white/20 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#00F59B]' : ''}`} />
          <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* 2. Controls / Filter Chips */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#0a1118] border border-white/10 w-fit">
          {SIDES.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSideChange(s.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                sideFilter === s.id
                  ? 'bg-[#0f1722] text-white border border-white/10 shadow-sm'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        <div className="text-xs text-gray-400 font-mono">
          Showing {trades.length} of {pagination.total || 0} trades
        </div>
      </div>

      {/* 3. Trade Records Section */}
      {isGlobalEmpty ? (
        <div
          data-testid="history-empty-state"
          className="p-8 sm:p-12 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] text-center backdrop-blur-xl flex flex-col items-center justify-center space-y-3"
        >
          <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-gray-400 mb-2">
            <Clock className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-white">No trades yet</h3>
          <p className="text-xs text-gray-400 max-w-sm">
            Your simulated trades will appear here after you practice buying or selling an asset.
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
      ) : !hasTrades ? (
        <div className="p-8 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] text-center backdrop-blur-xl space-y-2">
          <p className="text-sm font-semibold text-gray-300">No {sideFilter} trades found.</p>
          <p className="text-xs text-gray-500">Try switching your filter to "All Trades".</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View (hidden on mobile < 768px) */}
          <div className="hidden md:block rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] backdrop-blur-xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" data-testid="trades-table">
                <thead>
                  <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">Date & Time</th>
                    <th className="py-3.5 px-3">Asset</th>
                    <th className="py-3.5 px-3">Side</th>
                    <th className="py-3.5 px-3 text-right">Quantity</th>
                    <th className="py-3.5 px-3 text-right">Fill Price</th>
                    <th className="py-3.5 px-3 text-right">Trade Value</th>
                    <th className="py-3.5 px-3 text-right">Cost Basis</th>
                    <th className="py-3.5 px-4 text-right">Realized P&L</th>
                    <th className="py-3.5 px-3 text-center">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] text-xs">
                  {trades.map((t) => {
                    const isBuy = t.side === 'BUY';
                    const isSell = t.side === 'SELL';
                    const isProfit = (t.realizedProfitLossCents ?? 0) >= 0;

                    return (
                      <tr
                        key={t.id}
                        className="hover:bg-white/[0.02] transition-colors group"
                        data-testid={`trade-row-${t.id}`}
                      >
                        {/* Date & Time */}
                        <td className="py-4 px-4 font-mono text-gray-300 whitespace-nowrap">
                          {formatDateTime(t.executedAt)}
                        </td>

                        {/* Asset */}
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                                isBuy
                                  ? 'bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/30'
                                  : 'bg-[#A855F7]/10 text-[#A855F7] border border-[#A855F7]/30'
                              }`}
                            >
                              {t.symbol.slice(0, 3)}
                            </div>
                            <div>
                              <div className="font-bold text-white leading-tight">{t.assetName || t.symbol}</div>
                              <div className="text-[10px] text-gray-500 font-mono">{t.symbol}</div>
                            </div>
                          </div>
                        </td>

                        {/* Side */}
                        <td className="py-4 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase ${
                              isBuy
                                ? 'bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B]'
                                : 'bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7]'
                            }`}
                          >
                            {isBuy ? (
                              <ArrowDownLeft className="w-2.5 h-2.5" />
                            ) : (
                              <ArrowUpRight className="w-2.5 h-2.5" />
                            )}
                            <span>{t.side}</span>
                          </span>
                        </td>

                        {/* Quantity */}
                        <td className="py-4 px-3 text-right font-mono font-medium text-white">
                          {t.quantity} <span className="text-[10px] text-gray-500">{t.symbol}</span>
                        </td>

                        {/* Fill Price */}
                        <td className="py-4 px-3 text-right font-mono text-gray-200">
                          {t.executionPrice}
                        </td>

                        {/* Gross Value */}
                        <td className="py-4 px-3 text-right font-mono font-bold text-white">
                          {t.grossValue}
                        </td>

                        {/* Cost Basis (SELL trades only, "—" for BUY) */}
                        <td className="py-4 px-3 text-right font-mono text-gray-400">
                          {isSell && t.costBasis !== null ? t.costBasis : '—'}
                        </td>

                        {/* Realized P&L (SELL trades only, "—" for BUY) */}
                        <td className="py-4 px-4 text-right font-mono font-bold">
                          {isSell && t.realizedProfitLoss !== null ? (
                            <div className={isProfit ? 'text-[#00F59B]' : 'text-[#EF4444]'}>
                              <div>
                                {isProfit ? '+' : ''}{t.realizedProfitLoss}
                              </div>
                              <div className="text-[10px] font-semibold">
                                {t.realizedProfitLossPercentage !== null
                                  ? `${isProfit ? '+' : ''}${t.realizedProfitLossPercentage.toFixed(2)}%`
                                  : '—'}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-500 font-normal">—</span>
                          )}
                        </td>

                        {/* Order Type */}
                        <td className="py-4 px-3 text-center">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-gray-400">
                            {t.orderType}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Stacked Cards View (hidden on >= 768px) */}
          <div className="md:hidden space-y-3" data-testid="trades-cards-mobile">
            {trades.map((t) => {
              const isBuy = t.side === 'BUY';
              const isSell = t.side === 'SELL';
              const isProfit = (t.realizedProfitLossCents ?? 0) >= 0;

              return (
                <div
                  key={t.id}
                  className="p-4 rounded-2xl bg-[#0a1118]/80 border border-white/[0.08] backdrop-blur-xl space-y-3"
                  data-testid={`trade-card-${t.id}`}
                >
                  {/* Top: Side Badge, Asset Info, Date/Time */}
                  <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          isBuy
                            ? 'bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B]'
                            : 'bg-[#A855F7]/10 border border-[#A855F7]/30 text-[#A855F7]'
                        }`}
                      >
                        {isBuy ? <ArrowDownLeft className="w-2.5 h-2.5" /> : <ArrowUpRight className="w-2.5 h-2.5" />}
                        <span>{t.side}</span>
                      </span>
                      <span className="font-bold text-sm text-white">{t.symbol}</span>
                      <span className="text-xs text-gray-400">· {t.assetName || t.symbol}</span>
                    </div>
                    <span className="text-[10px] font-mono text-gray-500">
                      {formatDateTime(t.executedAt)}
                    </span>
                  </div>

                  {/* Quantity & Proceeds / Trade Value */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">Quantity</div>
                      <div className="font-mono font-medium text-white">{t.quantity} {t.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">Trade Value</div>
                      <div className="font-mono font-bold text-white">{t.grossValue}</div>
                    </div>
                  </div>

                  {/* Fill Price & Realized P&L */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-white/[0.04]">
                    <div>
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">Fill Price</div>
                      <div className="font-mono text-gray-200">{t.executionPrice}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-gray-400 uppercase font-semibold">Realized P&L</div>
                      <div
                        className={`font-mono font-bold ${
                          !isSell || t.realizedProfitLoss === null
                            ? 'text-gray-500 font-normal'
                            : isProfit
                            ? 'text-[#00F59B]'
                            : 'text-[#EF4444]'
                        }`}
                      >
                        {isSell && t.realizedProfitLoss !== null ? (
                          <span>
                            {isProfit ? '+' : ''}{t.realizedProfitLoss} ({t.realizedProfitLossPercentage !== null ? `${isProfit ? '+' : ''}${t.realizedProfitLossPercentage.toFixed(2)}%` : '—'})
                          </span>
                        ) : (
                          '—'
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cost Basis & Order Type */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-white/[0.04]">
                    <div className="text-gray-400">
                      <span className="text-[10px] uppercase font-semibold mr-1.5">Cost Basis:</span>
                      <span className="font-mono text-gray-300">{isSell && t.costBasis !== null ? t.costBasis : '—'}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.05] border border-white/10 text-gray-400">
                      {t.orderType}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 4. Pagination Bar */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-400 font-mono">
                Page {pagination.page} of {pagination.totalPages}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={!pagination.hasPreviousPage}
                  aria-label="Previous page"
                  className="p-2 rounded-xl bg-[#0a1118] border border-white/10 text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                  aria-label="Next page"
                  className="p-2 rounded-xl bg-[#0a1118] border border-white/10 text-gray-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* 5. Educational Disclaimer */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-[11px] text-gray-500 font-mono">
        <div className="flex items-center justify-center gap-1.5 mb-0.5">
          <Info className="w-3.5 h-3.5 text-gray-400" />
          <strong className="text-gray-400">EDUCATIONAL SIMULATION ONLY</strong>
        </div>
        <div>Historical record of virtual paper trades. No real money. No investment advice.</div>
      </div>
    </div>
  );
};

export default TradingHistoryPage;
