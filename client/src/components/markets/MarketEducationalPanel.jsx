import React, { useState } from 'react';
import { BookOpen, HelpCircle, ChevronDown, ChevronUp, Shield, Compass, Lightbulb } from 'lucide-react';

const MarketEducationalPanel = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] backdrop-blur-xl overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-5 sm:p-6 flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00D4FF]/10 border border-[#00D4FF]/30 flex items-center justify-center text-[#00D4FF]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-white font-sans flex items-center gap-2">
              <span>Beginner Compass: Understanding Crypto Charts</span>
            </h3>
            <p className="text-xs text-gray-400">
              Essential lessons for interpreting historical trends and avoiding beginner pitfalls.
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Toggle educational panel"
          className="p-2 rounded-lg text-gray-400 hover:text-white bg-white/[0.04] transition-colors"
        >
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Accordion Body */}
      {isOpen && (
        <div className="px-5 pb-6 sm:px-6 space-y-4 pt-2 border-t border-white/[0.06]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Timeframes */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-[#00F59B] text-xs font-bold font-mono">
                <Compass className="w-4 h-4" />
                <span>1. Timeframe Context</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                A sharp red drop on the <strong>24H</strong> view can look terrifying, but zooming out to <strong>30D</strong> or <strong>1Y</strong> often reveals it is simply normal consolidation inside a longer-term bull trend. Never judge an asset on short-term noise alone.
              </p>
            </div>

            {/* Card 2: 24/7 Volatility */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-[#00D4FF] text-xs font-bold font-mono">
                <Lightbulb className="w-4 h-4" />
                <span>2. 24/7 Price Discovery</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Unlike traditional stock exchanges with closing bells and weekends off, crypto markets operate 24 hours a day, 365 days a year globally. Prices move continuously as global buyers and sellers adjust their valuation.
              </p>
            </div>

            {/* Card 3: Highs and Lows */}
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold font-mono">
                <HelpCircle className="w-4 h-4" />
                <span>3. Period Range & Support</span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                Notice the <strong>Period High</strong> and <strong>Period Low</strong> below the chart. In technical analysis, price areas where sellers repeatedly take profits become <em>resistance</em>, while zones where buyers step in form <em>support</em>.
              </p>
            </div>
          </div>

          {/* Educational Disclaimer Banner */}
          <div className="p-3.5 rounded-xl bg-[#00D4FF]/5 border border-[#00D4FF]/20 flex items-start gap-3 text-xs">
            <Shield className="w-4 h-4 text-[#00D4FF] shrink-0 mt-0.5" />
            <div className="text-gray-300 leading-relaxed">
              <span className="font-semibold text-white">Paper-Trading Simulation Disclaimer: </span>
              Crypto Compass charts display real historical market data from CoinGecko for educational analysis. This simulator does not offer financial advice, real-money trading, or speculative recommendations. Past performance is not indicative of future market results.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketEducationalPanel;
