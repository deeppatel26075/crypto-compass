import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, TrendingDown, ArrowUpRight, AlertCircle } from 'lucide-react';

const DEMO_MARKETS = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    pair: 'BTC / USD',
    price: '$64,280.00',
    change: '+2.4%',
    isPositive: true,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    pair: 'ETH / USD',
    price: '$3,450.00',
    change: '+1.8%',
    isPositive: true,
  },
  {
    symbol: 'SOL',
    name: 'Solana',
    pair: 'SOL / USD',
    price: '$148.50',
    change: '+4.2%',
    isPositive: true,
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    pair: 'BNB / USD',
    price: '$585.00',
    change: '-0.6%',
    isPositive: false,
  },
];

const MarketOverview = () => {
  return (
    <div className="w-full rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] p-6 sm:p-7 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.3)]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white font-sans">
              Market Overview
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-[#00D4FF]/10 border border-[#00D4FF]/30 text-[10px] font-mono font-bold text-[#00D4FF]">
              DEMO MARKET DATA
            </span>
          </div>
          <p className="text-xs text-gray-400 font-sans mt-0.5">
            Static reference prices for educational analysis
          </p>
        </div>

        <Link
          to="/markets"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#00F59B] hover:text-white transition-colors"
        >
          <span>View All Markets</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid of Coins */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {DEMO_MARKETS.map((coin) => (
          <div
            key={coin.symbol}
            className="p-3.5 rounded-xl bg-[#050e18]/80 border border-white/[0.06] hover:border-white/[0.14] transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="font-bold text-white text-sm font-sans">{coin.symbol}</span>
                <span className="text-[11px] text-gray-400 ml-1.5 font-sans">{coin.name}</span>
              </div>
              <span className="text-[10px] font-mono text-gray-500 uppercase">
                {coin.pair}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline justify-between gap-1.5 pt-1">
              <span className="text-sm sm:text-base font-extrabold font-mono text-white truncate">
                {coin.price}
              </span>
              <span
                className={`text-[11px] sm:text-xs font-mono font-semibold flex items-center gap-0.5 shrink-0 ${
                  coin.isPositive ? 'text-[#00F59B]' : 'text-[#EF4444]'
                }`}
              >
                {coin.isPositive ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{coin.change}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Simulation Disclaimer Footer Strip */}
      <div className="pt-3 border-t border-white/[0.06] flex items-center gap-1.5 text-[11px] font-mono text-gray-400">
        <AlertCircle className="w-3.5 h-3.5 text-[#00D4FF] flex-shrink-0" />
        <span>SIMULATION ONLY · Static demo prices. Not live market data. No external API connected.</span>
      </div>
    </div>
  );
};

export default MarketOverview;
