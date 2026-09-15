import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  AlertCircle,
  Clock,
  ChevronRight,
} from 'lucide-react';
import { getMarketBySymbol } from '../services/marketService';
import { getTradingAccount } from '../services/tradingService';
import { formatPrice, formatCompactUSD, formatPercentage } from '../utils/marketFormatters';
import MarketPriceChart from '../components/markets/MarketPriceChart';
import MarketEducationalPanel from '../components/markets/MarketEducationalPanel';
import TradePanel from '../components/trading/TradePanel';
import TradeCoach from '../components/trading/TradeCoach';

// Popular quick switcher coins
const QUICK_COINS = [
  { symbol: 'BTC', name: 'Bitcoin' },
  { symbol: 'ETH', name: 'Ethereum' },
  { symbol: 'SOL', name: 'Solana' },
  { symbol: 'BNB', name: 'BNB' },
  { symbol: 'DOGE', name: 'Dogecoin' },
  { symbol: 'ADA', name: 'Cardano' },
  { symbol: 'AVAX', name: 'Avalanche' },
  { symbol: 'LINK', name: 'Chainlink' },
];

const MarketDetailPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [account, setAccount] = useState({ wallet: null, holdings: [] });
  const [orderIntent, setOrderIntent] = useState({ side: 'BUY', quantity: '' });

  const cleanSymbol = (symbol || 'btc').toUpperCase();

  // Fetch user's virtual wallet and active holdings for paper trading
  const fetchAccount = useCallback(async () => {
    try {
      const res = await getTradingAccount();
      if (res && res.success && res.data) {
        setAccount(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch trading account:', err.message);
    }
  }, []);

  useEffect(() => {
    fetchAccount();
  }, [fetchAccount]);

  // Fetch asset details from server proxy
  useEffect(() => {
    let isMounted = true;
    const fetchAsset = async () => {
      try {
        setLoading(true);
        const res = await getMarketBySymbol(symbol);
        if (isMounted) {
          if (res && res.data) {
            setAsset(res.data);
            setError(null);
            document.title = `${res.data.name} (${res.data.symbol}) Paper Trading | Crypto Compass`;
          } else {
            throw new Error('Asset not found');
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Asset details unavailable.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAsset();
    return () => {
      isMounted = false;
    };
  }, [symbol]);

  // Handle local state sync after trade execution
  const handleTradeCompleted = (data) => {
    if (data.wallet) {
      setAccount((prev) => {
        const updatedHoldings = [...(prev.holdings || [])];
        if (data.holding) {
          const idx = updatedHoldings.findIndex(
            (h) => h.symbol.toUpperCase() === data.holding.symbol.toUpperCase()
          );
          if (idx >= 0) {
            updatedHoldings[idx] = data.holding;
          } else {
            updatedHoldings.push(data.holding);
          }
        } else if (data.trade?.side === 'SELL') {
          const remaining = updatedHoldings.filter(
            (h) => h.symbol.toUpperCase() !== data.trade.symbol.toUpperCase()
          );
          return {
            wallet: data.wallet,
            holdings: remaining,
          };
        }
        return {
          wallet: data.wallet,
          holdings: updatedHoldings,
        };
      });
    }
    fetchAccount();
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-6xl mx-auto pb-10 animate-pulse">
        <div className="h-6 w-48 bg-white/10 rounded mb-4" />
        <div className="h-10 w-full bg-white/5 rounded-xl" />
        <div className="h-28 w-full bg-white/5 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-96 bg-white/5 rounded-2xl" />
          <div className="lg:col-span-4 h-96 bg-white/5 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center mx-auto text-[#EF4444]">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white font-sans">Asset Unavailable</h2>
        <p className="text-xs text-gray-400 max-w-md mx-auto">
          {error || `We couldn't retrieve live market data for "${cleanSymbol}". Please verify the symbol or return to the markets overview.`}
        </p>
        <div className="pt-2">
          <Link
            to="/markets"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F59B] text-[#020609] text-xs font-bold font-sans hover:bg-[#00F59B]/90 transition-all shadow-[0_0_20px_rgba(0,245,155,0.3)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Markets</span>
          </Link>
        </div>
      </div>
    );
  }

  const isPositive = asset.priceChange24h >= 0;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Breadcrumb Navigation & Quick Asset Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-mono text-gray-400">
          <Link
            to="/markets"
            className="hover:text-[#00F59B] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Markets</span>
          </Link>
          <ChevronRight className="w-3 h-3 text-gray-600" />
          <span className="text-white font-semibold">
            {asset.name} ({asset.symbol})
          </span>
        </nav>

        {/* Quick Switcher Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-[10px] font-mono text-gray-500 mr-1 shrink-0 uppercase">Quick:</span>
          {QUICK_COINS.map((c) => {
            const isSelected = c.symbol === asset.symbol;
            return (
              <button
                key={c.symbol}
                onClick={() => navigate(`/markets/${c.symbol.toLowerCase()}`)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-white/20 text-white border border-white/30'
                    : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.04]'
                }`}
              >
                {c.symbol}
              </button>
            );
          })}
        </div>
      </div>

      {/* Asset Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0a1420]/90 border border-white/[0.08] backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="flex items-center gap-4">
          {asset.image ? (
            <img src={asset.image} alt={asset.name} className="w-14 h-14 rounded-full" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B] font-bold text-lg font-mono">
              {asset.symbol.slice(0, 2)}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-sans">
                {asset.name}
              </h1>
              <span className="px-2 py-0.5 rounded bg-white/[0.06] text-xs font-mono text-gray-300">
                {asset.symbol}
              </span>
              <span className="px-2 py-0.5 rounded bg-[#00D4FF]/10 text-[10px] font-mono text-[#00D4FF] border border-[#00D4FF]/30">
                Rank #{asset.marketCapRank}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1 font-mono">
              Market Cap: {formatCompactUSD(asset.marketCap)} · 24h Volume: {formatCompactUSD(asset.volume24h)}
            </div>
          </div>
        </div>

        <div className="text-left md:text-right">
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white">
            {formatPrice(asset.currentPrice)}
          </div>
          <div className="flex md:justify-end items-center gap-2 mt-1">
            <span
              className={`inline-flex items-center gap-1 font-mono text-xs font-bold px-2 py-0.5 rounded ${
                isPositive ? 'text-[#00F59B] bg-[#00F59B]/10' : 'text-[#EF4444] bg-[#EF4444]/10'
              }`}
            >
              {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              <span>{formatPercentage(asset.priceChange24h)} (24h)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 24h Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0a1420]/80 border border-white/[0.08]">
          <span className="text-[10px] font-mono text-gray-400 uppercase">24h High</span>
          <div className="text-base font-bold font-mono text-white mt-1">
            {formatPrice(asset.high24h)}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#0a1420]/80 border border-white/[0.08]">
          <span className="text-[10px] font-mono text-gray-400 uppercase">24h Low</span>
          <div className="text-base font-bold font-mono text-white mt-1">
            {formatPrice(asset.low24h)}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#0a1420]/80 border border-white/[0.08]">
          <span className="text-[10px] font-mono text-gray-400 uppercase">Market Cap</span>
          <div className="text-base font-bold font-mono text-white mt-1">
            {formatCompactUSD(asset.marketCap)}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-[#0a1420]/80 border border-white/[0.08]">
          <span className="text-[10px] font-mono text-gray-400 uppercase">24h Total Volume</span>
          <div className="text-base font-bold font-mono text-white mt-1">
            {formatCompactUSD(asset.volume24h)}
          </div>
        </div>
      </div>

      {/* PHASE 8 & 9: Side-by-Side Chart and Active Paper Trading Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Price Chart (8 cols on desktop) */}
        <div className="lg:col-span-8 space-y-6">
          <MarketPriceChart symbol={asset.symbol} currentPrice={asset.currentPrice} />
          {/* Desktop Educational Panel */}
          <div className="hidden lg:block">
            <MarketEducationalPanel />
          </div>
        </div>

        {/* Right Column: Virtual Paper Trading Panel & Trade Coach (4 cols on desktop) */}
        <div className="lg:col-span-4 space-y-6">
          <TradePanel
            asset={asset}
            account={account}
            onTradeCompleted={handleTradeCompleted}
            onOrderChange={setOrderIntent}
          />
          <TradeCoach
            symbol={asset.symbol}
            side={orderIntent.side}
            quantity={orderIntent.quantity}
          />
        </div>
      </div>

      {/* Mobile Educational Panel (stacked below TradePanel on small screens) */}
      <div className="block lg:hidden">
        <MarketEducationalPanel />
      </div>

      {/* Safety Notice & Attribution */}
      <div className="pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-gray-500">
        <div className="flex items-center gap-1.5 text-gray-400">
          <ShieldCheck className="w-4 h-4 text-[#00F59B]" />
          <span>Crypto Compass Educational Simulator · Zero Real Money Involved</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Live Data via CoinGecko API Proxy · 60s Cache TTL</span>
        </div>
      </div>
    </div>
  );
};

export default MarketDetailPage;
