import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

/**
 * Formats integer cents into a standard USD display format ($10,000.00)
 */
const formatUSD = (cents) => {
  if (typeof cents !== 'number' || isNaN(cents)) {
    return '$10,000.00';
  }
  const dollars = cents / 100;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(dollars);
};

export default function VirtualWalletCard({ wallet, loading = false, error = null }) {
  if (loading) {
    return (
      <div className="w-full rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-xl animate-pulse">
        <div className="h-4 w-32 bg-white/10 rounded mb-4" />
        <div className="h-10 w-64 bg-white/10 rounded mb-3" />
        <div className="h-4 w-48 bg-white/10 rounded" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 p-6 sm:p-8 flex items-center gap-4 text-[#FCA5A5]">
        <ShieldAlert className="w-6 h-6 flex-shrink-0 text-[#EF4444]" />
        <div>
          <p className="font-bold text-sm">Unable to load virtual wallet</p>
          <p className="text-xs text-gray-400 mt-0.5">{error}</p>
        </div>
      </div>
    );
  }

  const cents = wallet?.cashBalanceCents ?? 1000000;
  const formattedBalance = formatUSD(cents);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-2xl bg-gradient-to-br from-[#0a1420]/90 to-[#030910]/95 border border-white/[0.08] p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)] group"
    >
      {/* Background Ambient Glow */}
      <div className="absolute -top-16 -right-16 w-48 h-48 bg-[#00F59B]/[0.08] rounded-full blur-2xl pointer-events-none group-hover:bg-[#00F59B]/[0.12] transition-colors duration-500" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-[#8A2BE2]/[0.05] rounded-full blur-2xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 relative z-10 mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B] shadow-[0_0_12px_rgba(0,245,155,0.2)]">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono font-bold tracking-widest text-gray-400 uppercase">
              Virtual Cash
            </span>
            <div className="flex items-center gap-1 text-[11px] text-[#00F59B] font-mono">
              <Sparkles className="w-3 h-3" />
              <span>Paper-Trading Account</span>
            </div>
          </div>
        </div>

        {/* Simulation Badge */}
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-mono text-gray-300 select-none">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#00F59B]" />
          <span>SIMULATION WALLET</span>
        </div>
      </div>

      {/* Main Balance Display */}
      <div className="relative z-10 mb-4 sm:mb-6">
        <div className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight font-sans">
          {formattedBalance}{' '}
          <span className="text-sm sm:text-base font-mono font-normal text-gray-400">
            {wallet?.currency || 'USD'}
          </span>
        </div>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-400 font-sans">
          Starting Virtual Cash
        </p>
      </div>

      {/* Disclaimer Footer Strip */}
      <div className="relative z-10 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-gray-500">
        <div className="flex items-center gap-1.5 text-[#00F59B]/80">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#00F59B]" />
          <span>Educational Simulation Only · No Real Money</span>
        </div>
        <span className="text-gray-500">
          Allocation: $10,000.00 Virtual USD
        </span>
      </div>
    </motion.div>
  );
}
