import React from 'react';
import { motion } from 'framer-motion';

/**
 * Cosmic Hero Visual for Phase 1
 * Recreates the celestial BTC, ETH, SOL orbital environment from the reference image
 * using high-fidelity layered SVG and CSS glows (strictly zero 3D libraries).
 */
const CosmicHeroVisual = () => {
  return (
    <div className="relative w-full max-w-[480px] h-[320px] mx-auto flex items-center justify-center overflow-visible select-none">
      {/* Background Cosmic Nebula Glows */}
      <div className="absolute w-72 h-72 rounded-full bg-cyan-accent/15 blur-[60px] -top-10 -left-10 pointer-events-none" />
      <div className="absolute w-80 h-80 rounded-full bg-neon/15 blur-[70px] top-10 right-0 pointer-events-none" />
      <div className="absolute w-64 h-64 rounded-full bg-purple/20 blur-[65px] bottom-0 left-1/4 pointer-events-none" />

      {/* Atmospheric Planet Arc in Background */}
      <div className="absolute -top-14 right-4 w-72 h-72 rounded-full border border-cyan/20 bg-gradient-to-b from-cyan-accent/10 to-transparent opacity-60 pointer-events-none" />

      {/* Orbital Light Rings */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 480 320">
        <ellipse
          cx="240"
          cy="165"
          rx="190"
          ry="75"
          fill="none"
          stroke="url(#cyanOrbit)"
          strokeWidth="1.5"
          transform="rotate(-15 240 165)"
          className="opacity-70"
        />
        <ellipse
          cx="250"
          cy="160"
          rx="140"
          ry="55"
          fill="none"
          stroke="url(#neonOrbit)"
          strokeWidth="1.2"
          transform="rotate(18 250 160)"
          className="opacity-60"
        />
        <defs>
          <linearGradient id="cyanOrbit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#8A2BE2" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00F59B" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="neonOrbit" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F59B" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00D4FF" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>

      {/* 1. Large Golden Bitcoin Coin (Center / Foreground) */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute z-20 left-[16%] top-[14%] w-36 h-36 md:w-44 md:h-44"
      >
        <div className="relative w-full h-full rounded-full p-[3px] bg-gradient-to-br from-yellow-200 via-yellow-500 to-amber-700 shadow-glow-gold">
          {/* Inner Coin Surface */}
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#b8860b] via-[#855d07] to-[#4a3404] border-[3px] border-[#ffd700]/70 flex items-center justify-center relative overflow-hidden">
            {/* Coin Radial Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_35%,rgba(255,235,150,0.5),transparent_60%)]" />
            {/* Coin Rim Gear Detail */}
            <div className="absolute inset-1.5 rounded-full border border-dashed border-[#ffe066]/40" />
            {/* Bitcoin 'B' Symbol */}
            <div className="relative text-4xl md:text-5xl font-extrabold text-[#fff3a8] tracking-wider drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] select-none">
              ₿
            </div>
          </div>
        </div>
      </motion.div>

      {/* 2. Blue Diamond Ethereum Crystal (Top Right) */}
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        className="absolute z-10 right-[24%] top-[8%] w-24 h-24 md:w-28 md:h-28"
      >
        <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-br from-blue-400/80 via-cyan-500/40 to-space-900 shadow-glow-cyan">
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#0e2744] via-[#09182d] to-[#040b15] border border-cyan-accent/50 flex items-center justify-center relative">
            <svg className="w-12 h-12 md:w-14 md:h-14 text-cyan-accent drop-shadow-[0_0_12px_rgba(0,212,255,0.7)]" viewBox="0 0 256 417" fill="currentColor">
              <path fillOpacity="0.7" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z" />
              <path fillOpacity="0.9" d="M127.962 0L0 212.32l127.962 75.639V0z" />
              <path fillOpacity="0.6" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z" />
              <path fillOpacity="0.8" d="M127.962 416.905v-104.72L0 236.585z" />
              <path fillOpacity="0.4" d="M127.961 287.958l127.96-75.637-127.96-58.161z" />
              <path fillOpacity="0.5" d="M0 212.32l127.96 75.638v-133.8z" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* 3. Purple & Cyan Striped Solana Coin (Bottom Right) */}
      <motion.div
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute z-15 right-[6%] bottom-[12%] w-20 h-20 md:w-24 md:h-24"
      >
        <div className="relative w-full h-full rounded-full p-2 bg-gradient-to-br from-purple via-cyan-accent/50 to-space-900 shadow-glow-purple">
          <div className="w-full h-full rounded-full bg-gradient-to-b from-[#180a29] to-[#0a0512] border border-purple/60 flex items-center justify-center flex-col gap-1.5 p-3">
            {/* Solana 3 glowing horizontal bars */}
            <div className="w-9 h-1.5 rounded-full bg-gradient-to-r from-cyan-accent to-purple transform -skew-x-12 shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
            <div className="w-9 h-1.5 rounded-full bg-gradient-to-r from-purple to-neon transform skew-x-12 shadow-[0_0_8px_rgba(138,43,226,0.6)]" />
            <div className="w-9 h-1.5 rounded-full bg-gradient-to-r from-neon to-cyan-accent transform -skew-x-12 shadow-[0_0_8px_rgba(0,245,155,0.6)]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CosmicHeroVisual;
