import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowRight, Lightbulb } from 'lucide-react';

const RECOMMENDATION_MAP = {
  crypto_fundamentals: {
    title: 'Start with Crypto Fundamentals',
    description: 'Build a strong foundation in blockchain, crypto, wallets, and market basics.',
    tag: 'Foundational Knowledge',
  },
  practice_trading: {
    title: 'Prepare for Paper Trading',
    description: 'Learn the fundamentals and risk concepts before practicing with virtual money.',
    tag: 'Preparation Track',
  },
  technical_analysis: {
    title: 'Technical Analysis Foundations',
    description: 'Learn how charts, candlesticks, support, resistance, and indicators work.',
    tag: 'Chart Literacy',
  },
  risk_management: {
    title: 'Risk Management Foundations',
    description: 'Understand position sizing, exposure, and how to manage risk in volatile markets.',
    tag: 'Capital Protection',
  },
  trading_discipline: {
    title: 'Build Trading Discipline',
    description: 'Learn how to recognize FOMO, emotional decisions, and impulsive trading behavior.',
    tag: 'Psychology & Mindset',
  },
};

const DEFAULT_RECOMMENDATION = {
  title: 'Start Your Crypto Journey',
  description: 'Explore the fundamentals and build your knowledge step by step.',
  tag: 'Core Curriculum',
};

const RecommendedNextStep = ({ user }) => {
  const goal = user?.onboarding?.primaryGoal;
  const recommendation = (goal && RECOMMENDATION_MAP[goal]) || DEFAULT_RECOMMENDATION;

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-[#0c1827]/90 to-[#050e18]/95 border border-[#00F59B]/20 p-6 sm:p-7 backdrop-blur-xl relative overflow-hidden flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.4)] group">
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#00F59B]/[0.06] rounded-full blur-2xl pointer-events-none group-hover:bg-[#00F59B]/[0.1] transition-all" />

      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 text-[11px] font-mono text-[#00F59B]">
            <Lightbulb className="w-3.5 h-3.5" />
            <span>RECOMMENDED NEXT STEP</span>
          </div>
          <span className="text-[10px] font-mono text-gray-400 uppercase">
            {recommendation.tag}
          </span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight font-sans mb-2">
          {recommendation.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-300 font-sans leading-relaxed">
          {recommendation.description}
        </p>
      </div>

      <div className="pt-5 mt-4 border-t border-white/[0.06] flex items-center justify-between">
        <span className="text-[11px] font-mono text-gray-400">
          Module 1 · Getting Started
        </span>
        <Link
          to="/learn"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#00F59B] text-[#020609] text-xs font-bold font-sans hover:bg-[#00F59B]/90 transition-all shadow-[0_0_15px_rgba(0,245,155,0.25)] hover:shadow-[0_0_20px_rgba(0,245,155,0.4)]"
        >
          <span>Continue Learning</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default RecommendedNextStep;
