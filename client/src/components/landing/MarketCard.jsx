import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export default function MarketCard({
  symbol = 'BTC',
  name = 'Bitcoin',
  price = '$67,432',
  change = '+2.4%',
  color = '#00F59B',
  delay = 0,
  className = '',
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.05, y: -4 }}
      className={`relative group rounded-2xl bg-[#081018]/85 backdrop-blur-xl border border-white/[0.12] p-3.5 shadow-[0_12px_30px_rgba(0,0,0,0.7)] hover:border-[#00F59B]/50 transition-all select-none ${className}`}
    >
      {/* Top subtle glow on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.04] to-transparent pointer-events-none" />

      <div className="flex items-center justify-between gap-4 mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: color, boxShadow: `0 0 10px ${color}` }}
          />
          <span className="font-extrabold text-xs text-white tracking-wider">{symbol}</span>
          <span className="text-[10px] text-gray-400 font-sans">{name}</span>
        </div>

        {/* Explicit SIMULATION / PRACTICE badge */}
        <span className="text-[9px] font-mono font-bold tracking-widest text-gray-400 bg-white/[0.06] border border-white/[0.08] px-1.5 py-0.5 rounded">
          SIMULATION
        </span>
      </div>

      <div className="flex items-baseline justify-between gap-3">
        <span className="font-extrabold text-base tracking-tight text-white font-mono">
          {price}
        </span>
        <div className="flex items-center gap-1 text-[11px] font-bold text-[#00F59B]">
          <TrendingUp className="w-3 h-3" />
          <span>{change}</span>
        </div>
      </div>

      {/* Decorative mini sparkline curve */}
      <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between">
        <svg className="w-24 h-5 overflow-visible" viewBox="0 0 96 20" fill="none">
          <path
            d="M0 16 Q 16 12, 32 14 T 64 6 T 96 2"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="96" cy="2" r="2.5" fill={color} className="animate-pulse" />
        </svg>
        <span className="text-[9px] text-gray-400 font-mono">24h Sim</span>
      </div>
    </motion.div>
  );
}
