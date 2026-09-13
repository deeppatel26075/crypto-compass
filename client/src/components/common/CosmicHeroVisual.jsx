import React from 'react';
import { motion } from 'framer-motion';

/**
 * Cosmic Hero Visual
 * Uses the exact high-fidelity celestial 3D Bitcoin, Ethereum, and Solana composition
 * with orbital light rings, space mountains, and stats pill from the reference mockup.
 */
const CosmicHeroVisual = () => {
  return (
    <div className="relative w-full flex items-center justify-center select-none overflow-visible">
      {/* Ambient background glows */}
      <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-[#00D4FF]/15 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-80 h-80 rounded-full bg-[#00F59B]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-1/4 w-60 h-60 rounded-full bg-[#8A2BE2]/20 blur-3xl pointer-events-none" />

      {/* High-Fidelity 3D Crypto Artwork with subtle floating micro-animation */}
      <motion.div
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-10 w-full max-w-[540px] flex items-center justify-end"
      >
        <img
          src="/assets/hero-artwork-perfect.png"
          alt="Bitcoin, Ethereum, and Solana Cosmic 3D Composition"
          className="w-full h-auto object-contain rounded-2xl drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)]"
        />
      </motion.div>
    </div>
  );
};

export default CosmicHeroVisual;
