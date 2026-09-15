import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  Search,
  RefreshCw,
  AlertCircle,
  Clock,
  ArrowUpDown,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import { getMarkets } from '../services/marketService';
import { formatPrice, formatCompactUSD, formatPercentage } from '../utils/marketFormatters';
import Skeleton from '../components/ui/Skeleton';

const MarketsPage = () => {
  const navigate = useNavigate();

  const [markets, setMarkets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [cachedAt, setCachedAt] = useState(null);

  // Search & Sorting Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('marketCap'); // 'marketCap', 'price', 'change24h', 'volume'
  const [sortDirection, setSortDirection] = useState('desc'); // 'asc', 'desc'

  const fetchMarketData = useCallback(async (force = false) => {
    try {
      if (force) setRefreshing(true);
      else setLoading(true);

      const res = await getMarkets(force);
      if (res && res.data) {
        setMarkets(res.data);
        setIsStale(Boolean(res.isStale));
        setCachedAt(res.cachedAt);
        setError(null);
      } else {
        throw new Error('No market data returned.');
      }
    } catch (err) {
      setError(err.message || 'Market data is temporarily unavailable. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  // Handle Sort Toggle
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection((prev) => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  // Filtered and Sorted list
  const filteredMarkets = useMemo(() => {
    let list = [...markets];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.symbol.toLowerCase().includes(q) ||
          m.id.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      if (sortBy === 'marketCap') {
        valA = a.marketCap;
        valB = b.marketCap;
      } else if (sortBy === 'price') {
        valA = a.currentPrice;
        valB = b.currentPrice;
      } else if (sortBy === 'change24h') {
        valA = a.priceChange24h;
        valB = b.priceChange24h;
      } else if (sortBy === 'volume') {
        valA = a.volume24h;
        valB = b.volume24h;
      }

      if (sortDirection === 'asc') return valA - valB;
      return valB - valA;
    });

    return list;
  }, [markets, searchQuery, sortBy, sortDirection]);

  // Market Summary Calculations
  const summaryMetrics = useMemo(() => {
    if (!markets || markets.length === 0) return null;

    const totalAssets = markets.length;
    const topMarketCap = markets[0]; // Ordered by market cap initially
    const bestPerformer = [...markets].sort((a, b) => b.priceChange24h - a.priceChange24h)[0];
    const totalTrackedVolume = markets.reduce((acc, m) => acc + (m.volume24h || 0), 0);

    return {
      totalAssets,
      topAsset: topMarketCap ? `${topMarketCap.name} (${topMarketCap.symbol})` : '—',
      bestPerformer: bestPerformer ? `${bestPerformer.symbol} (${formatPercentage(bestPerformer.priceChange24h)})` : '—',
      isBestPositive: bestPerformer?.priceChange24h >= 0,
      totalVolume: formatCompactUSD(totalTrackedVolume),
    };
  }, [markets]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-1 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
              Crypto Markets
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[11px] font-mono text-[#00D4FF]">
              <Activity className="w-3 h-3" />
              MARKET DATA
            </span>
            {isStale && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F59E0B]/10 border border-[#F59E0B]/30 text-[10px] font-mono text-[#F59E0B]">
                CACHED DATA
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-gray-400 font-sans">
            Explore spot market pricing, 24-hour volume, and market capitalization across top crypto assets.
          </p>
        </div>

        {/* Refresh & Last Updated Control */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {cachedAt && (
            <div className="hidden md:flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
              <Clock className="w-3.5 h-3.5 text-gray-500" />
              <span>Updated recently</span>
            </div>
          )}

          <button
            onClick={() => fetchMarketData(true)}
            disabled={loading || refreshing}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0a1420]/80 hover:bg-[#0f1d2e] border border-white/[0.08] hover:border-white/[0.18] text-xs font-semibold text-gray-200 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-[#00F59B]' : 'text-gray-400'}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* 2. Market Summary Strip */}
      {summaryMetrics && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 rounded-xl bg-[#0a1420]/80 border border-white/[0.08] backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
              Assets Tracked
            </div>
            <div className="text-xl font-bold font-mono text-white tracking-tight">
              {summaryMetrics.totalAssets}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">Top market universe</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0a1420]/80 border border-white/[0.08] backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
              Top Asset by Cap
            </div>
            <div className="text-base sm:text-lg font-bold font-sans text-white truncate" title={summaryMetrics.topAsset}>
              {summaryMetrics.topAsset}
            </div>
            <div className="text-[11px] text-[#00D4FF] mt-0.5">Market Leader</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0a1420]/80 border border-white/[0.08] backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
              Top 24h Mover
            </div>
            <div className={`text-base sm:text-lg font-bold font-mono truncate ${summaryMetrics.isBestPositive ? 'text-[#00F59B]' : 'text-[#EF4444]'}`}>
              {summaryMetrics.bestPerformer}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">Best 24h Change</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0a1420]/80 border border-white/[0.08] backdrop-blur-xl">
            <div className="text-[10px] font-mono uppercase tracking-wider text-gray-400 mb-1">
              Tracked 24h Volume
            </div>
            <div className="text-xl font-bold font-mono text-white tracking-tight">
              {summaryMetrics.totalVolume}
            </div>
            <div className="text-[11px] text-gray-500 mt-0.5">Total spot turnover</div>
          </div>
        </div>
      )}

      {/* 3. Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by symbol or name (BTC, Ethereum...)"
            className="w-full bg-[#0a1118]/90 text-gray-200 text-xs rounded-xl pl-9 pr-4 py-2.5 border border-white/[0.09] hover:border-white/[0.18] focus:border-[#00F59B] focus:ring-1 focus:ring-[#00F59B]/30 outline-none transition-all placeholder-gray-500 font-sans"
          />
        </div>

        {/* Sort Pill Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-mono">
          <span className="text-[11px] text-gray-400 mr-1 hidden md:inline">Sort:</span>
          {[
            { id: 'marketCap', label: 'Market Cap' },
            { id: 'price', label: 'Price' },
            { id: 'change24h', label: '24h %' },
            { id: 'volume', label: 'Volume' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => handleSort(pill.id)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1 whitespace-nowrap ${
                sortBy === pill.id
                  ? 'bg-[#00F59B]/10 border-[#00F59B]/50 text-[#00F59B]'
                  : 'bg-[#0a1420]/60 border-white/[0.06] text-gray-400 hover:text-white hover:border-white/[0.14]'
              }`}
            >
              <span>{pill.label}</span>
              {sortBy === pill.id && (
                <ArrowUpDown className="w-3 h-3 text-[#00F59B]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Error State with Retry */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#FCA5A5]">
          <div className="flex items-center gap-3 text-center sm:text-left">
            <AlertCircle className="w-6 h-6 flex-shrink-0 text-[#EF4444]" />
            <div>
              <p className="font-bold text-sm">Market data unavailable</p>
              <p className="text-xs text-gray-300 mt-0.5">{error}</p>
            </div>
          </div>
          <button
            onClick={() => fetchMarketData(true)}
            className="px-4 py-2 rounded-xl bg-[#EF4444] text-white text-xs font-bold hover:bg-[#DC2626] transition-colors"
          >
            Retry Connection
          </button>
        </div>
      )}

      {/* 5. Skeleton Loading State */}
      {loading && (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-[#0a1420]/60 border border-white/[0.06] animate-pulse flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/[0.06]" />
                <div className="space-y-1.5">
                  <div className="w-24 h-3.5 bg-white/10 rounded" />
                  <div className="w-14 h-2.5 bg-white/[0.06] rounded" />
                </div>
              </div>
              <div className="w-24 h-4 bg-white/10 rounded" />
              <div className="w-16 h-3 bg-white/[0.06] rounded hidden sm:block" />
            </div>
          ))}
        </div>
      )}

      {/* 6. Empty State */}
      {!loading && !error && filteredMarkets.length === 0 && (
        <div className="p-12 text-center rounded-2xl bg-[#0a1420]/50 border border-white/[0.06]">
          <Search className="w-10 h-10 text-gray-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No assets found</h3>
          <p className="text-xs text-gray-400">
            Try searching for a different symbol or name like "BTC" or "Ethereum".
          </p>
        </div>
      )}

      {/* 7. Desktop Table View */}
      {!loading && !error && filteredMarkets.length > 0 && (
        <>
          <div className="hidden md:block rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] backdrop-blur-xl overflow-x-auto shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[#050e18]/60 text-[10px] font-mono uppercase tracking-wider text-gray-400 select-none">
                  <th className="py-3.5 px-4 font-bold text-center w-12">#</th>
                  <th className="py-3.5 px-4 font-bold">Asset</th>
                  <th className="py-3.5 px-4 font-bold text-right">Price</th>
                  <th className="py-3.5 px-4 font-bold text-right">24h Change</th>
                  <th className="py-3.5 px-4 font-bold text-right hidden lg:table-cell">24h High / Low</th>
                  <th className="py-3.5 px-4 font-bold text-right">Market Cap</th>
                  <th className="py-3.5 px-4 font-bold text-right hidden xl:table-cell">24h Volume</th>
                  <th className="py-3.5 px-4 font-bold text-center w-20">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-xs">
                {filteredMarkets.map((coin) => {
                  const isPositive = coin.priceChange24h >= 0;
                  return (
                    <tr
                      key={coin.id}
                      onClick={() => navigate(`/markets/${coin.symbol.toLowerCase()}`)}
                      className="hover:bg-[#0c1827]/70 cursor-pointer transition-colors group"
                    >
                      {/* Rank */}
                      <td className="py-4 px-4 text-center font-mono text-gray-500 text-[11px]">
                        {coin.marketCapRank || '—'}
                      </td>

                      {/* Asset */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {coin.image ? (
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-8 h-8 rounded-full flex-shrink-0"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B] text-xs font-bold">
                              {coin.symbol.slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white font-sans text-sm group-hover:text-[#00F59B] transition-colors flex items-center gap-1.5">
                              <span>{coin.name}</span>
                              <span className="text-[10px] font-mono text-gray-400 bg-white/[0.04] px-1.5 py-0.2 rounded">
                                {coin.symbol}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Current Price */}
                      <td className="py-4 px-4 text-right font-mono font-bold text-white text-sm">
                        {formatPrice(coin.currentPrice)}
                      </td>

                      {/* 24h Change */}
                      <td className="py-4 px-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                            isPositive
                              ? 'text-[#00F59B] bg-[#00F59B]/10'
                              : 'text-[#EF4444] bg-[#EF4444]/10'
                          }`}
                        >
                          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          <span>{formatPercentage(coin.priceChange24h)}</span>
                        </span>
                      </td>

                      {/* 24h High / Low */}
                      <td className="py-4 px-4 text-right font-mono text-[11px] text-gray-400 hidden lg:table-cell">
                        <div>H: {formatPrice(coin.high24h)}</div>
                        <div className="text-gray-500">L: {formatPrice(coin.low24h)}</div>
                      </td>

                      {/* Market Cap */}
                      <td className="py-4 px-4 text-right font-mono text-gray-200">
                        {formatCompactUSD(coin.marketCap)}
                      </td>

                      {/* 24h Volume */}
                      <td className="py-4 px-4 text-right font-mono text-gray-400 hidden xl:table-cell">
                        {formatCompactUSD(coin.volume24h)}
                      </td>

                      {/* Action Chevron */}
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#00F59B] group-hover:translate-x-0.5 transition-transform">
                          <span>View</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 8. Mobile Card View */}
          <div className="block md:hidden space-y-3">
            {filteredMarkets.map((coin) => {
              const isPositive = coin.priceChange24h >= 0;
              return (
                <div
                  key={coin.id}
                  onClick={() => navigate(`/markets/${coin.symbol.toLowerCase()}`)}
                  className="p-4 rounded-xl bg-[#0a1420]/90 border border-white/[0.08] active:bg-[#0f1f33] transition-colors flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {coin.image ? (
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B] text-xs font-bold">
                          {coin.symbol.slice(0, 2)}
                        </div>
                      )}
                      <div>
                        <div className="font-bold text-white font-sans text-sm flex items-center gap-1.5">
                          <span>{coin.name}</span>
                          <span className="text-[10px] font-mono text-gray-400">
                            {coin.symbol}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">
                          Rank #{coin.marketCapRank}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-white text-base">
                        {formatPrice(coin.currentPrice)}
                      </div>
                      <span
                        className={`inline-flex items-center gap-0.5 font-mono text-xs font-semibold ${
                          isPositive ? 'text-[#00F59B]' : 'text-[#EF4444]'
                        }`}
                      >
                        {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        <span>{formatPercentage(coin.priceChange24h)}</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-gray-400">
                    <div>
                      <span className="text-gray-500">Cap: </span>
                      {formatCompactUSD(coin.marketCap)}
                    </div>
                    <div>
                      <span className="text-gray-500">Vol: </span>
                      {formatCompactUSD(coin.volume24h)}
                    </div>
                    <div className="text-[#00F59B] font-bold flex items-center gap-0.5">
                      <span>View</span>
                      <ChevronRight className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Disclaimer Strip */}
      <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-gray-500 text-center sm:text-left">
        <div className="flex items-center gap-1.5 text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B]" />
          <span>Educational Simulation Platform · No Financial Advice · Periodic Market Data</span>
        </div>
        <span>Data cached server-side (60s TTL)</span>
      </div>
    </div>
  );
};

export default MarketsPage;
