import React from 'react';
import { motion } from 'framer-motion';

/**
 * Cosmic Hero Visual
 * Faithfully recreates the celestial 3D Bitcoin, Ethereum, and Solana orbital composition
 * from the reference image with rich metallic bevels, crystal facets, and glowing orbital rings.
 */
const CosmicHeroVisual = () => {
  return (
    <div className="relative w-full max-w-[520px] h-[340px] mx-auto flex items-center justify-center select-none overflow-visible">
      {/* Background Cosmic Atmosphere & Planet Limb Glow */}
      <div className="absolute -top-16 -right-10 w-80 h-80 rounded-full bg-gradient-to-bl from-cyan-accent/20 via-blue-600/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 rounded-full bg-neon/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-2 right-1/4 w-60 h-60 rounded-full bg-purple/25 blur-3xl pointer-events-none" />

      {/* Atmospheric Planet Curve */}
      <svg className="absolute -top-6 -right-2 w-72 h-72 pointer-events-none opacity-60" viewBox="0 0 200 200">
        <circle cx="150" cy="50" r="90" fill="none" stroke="url(#planetAtmosphere)" strokeWidth="2.5" />
        <defs>
          <linearGradient id="planetAtmosphere" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#00F59B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Orbital Glowing Ellipses */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" viewBox="0 0 520 340">
        {/* Outer Cyan Ring */}
        <ellipse
          cx="280"
          cy="160"
          rx="185"
          ry="78"
          fill="none"
          stroke="url(#ringCyan)"
          strokeWidth="1.8"
          transform="rotate(-20 280 160)"
          className="opacity-80"
        />
        {/* Inner Green/Cyan Ring */}
        <ellipse
          cx="290"
          cy="165"
          rx="145"
          ry="62"
          fill="none"
          stroke="url(#ringNeon)"
          strokeWidth="1.4"
          transform="rotate(22 290 165)"
          className="opacity-70"
        />

        {/* Orbit Node Specular Highlights */}
        <circle cx="160" cy="110" r="2.5" fill="#00D4FF" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 4px #00D4FF)' }} />
        <circle cx="430" cy="190" r="3" fill="#00F59B" className="animate-pulse" style={{ filter: 'drop-shadow(0 0 6px #00F59B)' }} />
        <circle cx="360" cy="70" r="2" fill="#FFFFFF" className="animate-pulse" />

        <defs>
          <linearGradient id="ringCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4FF" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#8A2BE2" stopOpacity="0.4" />
            <stop offset="80%" stopColor="#00F59B" stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <linearGradient id="ringNeon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00F59B" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#00D4FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8A2BE2" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>

      {/* ========================================================================= */}
      {/* 1. EMBOSSED 3D GOLDEN BITCOIN COIN (Center / Foreground)                  */}
      {/* ========================================================================= */}
      <motion.div
        animate={{ y: [0, -7, 0], rotate: [0, 1, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute z-20 left-[14%] sm:left-[16%] top-[8%] w-44 h-44 sm:w-48 sm:h-48"
      >
        <div className="relative w-full h-full rounded-full shadow-[0_0_50px_rgba(255,191,0,0.45)]">
          <svg className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.85)]" viewBox="0 0 200 200">
            <defs>
              {/* Gold rim gradient with directional metallic reflection */}
              <linearGradient id="btcGoldOuter" x1="20%" y1="0%" x2="80%" y2="100%">
                <stop offset="0%" stopColor="#FFF2A3" />
                <stop offset="25%" stopColor="#F5C042" />
                <stop offset="50%" stopColor="#9C680A" />
                <stop offset="75%" stopColor="#FAD36B" />
                <stop offset="100%" stopColor="#5E3A02" />
              </linearGradient>

              {/* Inner coin sunken bed */}
              <radialGradient id="btcInnerBed" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#E6AE33" />
                <stop offset="45%" stopColor="#A87413" />
                <stop offset="85%" stopColor="#5C3B02" />
                <stop offset="100%" stopColor="#2E1B00" />
              </radialGradient>

              {/* Beveled ₿ monogram gradient */}
              <linearGradient id="btcBevel" x1="30%" y1="0%" x2="70%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="30%" stopColor="#FFF1AA" />
                <stop offset="70%" stopColor="#D99B20" />
                <stop offset="100%" stopColor="#734B03" />
              </linearGradient>
            </defs>

            {/* Outer Thick Beveled Rim */}
            <circle cx="100" cy="100" r="95" fill="url(#btcGoldOuter)" />
            <circle cx="100" cy="100" r="88" fill="#5A3903" />
            <circle cx="100" cy="100" r="86" fill="url(#btcGoldOuter)" />

            {/* Milled Ridge Gear Teeth on Outer Border */}
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="#FFE885"
              strokeWidth="2.5"
              strokeDasharray="3, 2.5"
              opacity="0.6"
            />

            {/* Sunken Inner Surface */}
            <circle cx="100" cy="100" r="74" fill="url(#btcInnerBed)" />

            {/* Concentric Circuit Line Details */}
            <circle cx="100" cy="100" r="66" fill="none" stroke="#F5C756" strokeWidth="1" opacity="0.35" />
            <circle cx="100" cy="100" r="58" fill="none" stroke="#F5C756" strokeWidth="0.8" opacity="0.25" />

            {/* Top Specular Crescent Arc */}
            <path
              d="M 36 90 A 70 70 0 0 1 164 90 A 64 64 0 0 0 36 90"
              fill="#FFFFFF"
              opacity="0.3"
            />

            {/* Bold Embossed Bitcoin Symbol ₿ */}
            <g transform="translate(100, 100) scale(1.1) translate(-100, -100)">
              {/* Drop Shadow for Depth */}
              <path
                d="M86 52 h12 v-8 h8 v8 h8 v-8 h8 v8 c14 0 24 3 24 16 c0 8 -5 13 -12 15 c10 2 16 8 16 18 c0 14 -11 18 -26 18 v8 h-8 v-8 h-8 v8 h-8 v-8 h-12 v-8 h8 v-60 h-8 z M106 64 v18 h14 c6 0 10 -2 10 -9 c0 -6 -4 -9 -10 -9 z M106 94 v20 h16 c7 0 11 -2 11 -10 c0 -7 -4 -10 -11 -10 z"
                fill="#2E1B00"
                transform="translate(2, 3)"
                opacity="0.8"
              />
              {/* Embossed Gold ₿ */}
              <path
                d="M86 52 h12 v-8 h8 v8 h8 v-8 h8 v8 c14 0 24 3 24 16 c0 8 -5 13 -12 15 c10 2 16 8 16 18 c0 14 -11 18 -26 18 v8 h-8 v-8 h-8 v8 h-8 v-8 h-12 v-8 h8 v-60 h-8 z M106 64 v18 h14 c6 0 10 -2 10 -9 c0 -6 -4 -9 -10 -9 z M106 94 v20 h16 c7 0 11 -2 11 -10 c0 -7 -4 -10 -11 -10 z"
                fill="url(#btcBevel)"
              />
            </g>
          </svg>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 2. FACETED 3D ETHEREUM CRYSTAL GEM (Top Right)                           */}
      {/* ========================================================================= */}
      <motion.div
        animate={{ y: [0, 8, 0], rotate: [0, 2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="absolute z-10 right-[20%] sm:right-[22%] top-[5%] w-28 h-28 sm:w-32 sm:h-32"
      >
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#0a1e3b] via-[#051124] to-[#02070f] border border-cyan-accent/50 p-2 shadow-[0_0_35px_rgba(0,212,255,0.55)]">
          {/* Subtle Outer Glow Ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-accent/30 animate-pulse" />

          {/* Faceted 3D Diamond SVG */}
          <svg className="w-full h-full p-2 drop-shadow-[0_0_15px_rgba(0,212,255,0.7)]" viewBox="0 0 256 417">
            <defs>
              <linearGradient id="ethFacetTopLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="40%" stopColor="#6EE7B7" />
                <stop offset="100%" stopColor="#00D4FF" />
              </linearGradient>
              <linearGradient id="ethFacetTopRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D4FF" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
              <linearGradient id="ethFacetBottomLeft" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00D4FF" />
                <stop offset="100%" stopColor="#0F172A" />
              </linearGradient>
              <linearGradient id="ethFacetBottomRight" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#020617" />
              </linearGradient>
            </defs>

            {/* Top Pyramid Facets */}
            <path d="M127.96 0 L0 212.32 L127.96 287.95 Z" fill="url(#ethFacetTopLeft)" />
            <path d="M127.96 0 L127.96 287.95 L255.92 212.32 Z" fill="url(#ethFacetTopRight)" />
            
            {/* Bottom Pyramid Facets */}
            <path d="M127.96 312.18 L0 236.58 L127.96 416.9 Z" fill="url(#ethFacetBottomLeft)" />
            <path d="M127.96 312.18 L127.96 416.9 L255.92 236.58 Z" fill="url(#ethFacetBottomRight)" />

            {/* Center Facet Ridge Light Line */}
            <line x1="127.96" y1="0" x2="127.96" y2="416.9" stroke="#FFFFFF" strokeWidth="4" opacity="0.6" />
          </svg>
        </div>
      </motion.div>

      {/* ========================================================================= */}
      {/* 3. 3D SOLANA NEON STRIPED COIN (Bottom Right)                            */}
      {/* ========================================================================= */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="absolute z-15 right-[6%] sm:right-[8%] bottom-[12%] w-24 h-24 sm:w-28 sm:h-28"
      >
        <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[#1a0c2e] via-[#0d0718] to-[#040209] border border-purple-500/60 p-2.5 shadow-[0_0_35px_rgba(138,43,226,0.6)] flex items-center justify-center">
          {/* Subtle Outer Neon Ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-accent/20" />

          {/* 3 Glowing Skewed Solana Bars */}
          <div className="w-full flex flex-col items-center justify-center gap-2 px-2">
            {/* Top Bar (Cyan to Purple) */}
            <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-[#00D4FF] via-[#7C3AED] to-[#9333EA] transform -skew-x-12 shadow-[0_0_12px_rgba(0,212,255,0.7)]" />
            {/* Middle Bar (Purple to Magenta) */}
            <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-[#A855F7] via-[#EC4899] to-[#8A2BE2] transform skew-x-12 shadow-[0_0_12px_rgba(168,85,247,0.7)]" />
            {/* Bottom Bar (Magenta to Neon Green) */}
            <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-[#8A2BE2] via-[#00D4FF] to-[#00F59B] transform -skew-x-12 shadow-[0_0_12px_rgba(0,245,155,0.7)]" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default CosmicHeroVisual;
