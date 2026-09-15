import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Sparkles, TrendingUp, Users } from 'lucide-react';
import CryptoScene from './CryptoScene';
import MarketCard from './MarketCard';

const benefits = [
  { label: 'No Real Money', icon: Shield, color: 'text-[#00F59B]' },
  { label: 'Learn by Doing', icon: Sparkles, color: 'text-[#00D4FF]' },
  { label: 'Build Real Skills', icon: TrendingUp, color: 'text-[#8A2BE2]' },
  { label: 'For Everyone', icon: Users, color: 'text-[#F59E0B]' },
];

export default function HeroSection({ onOpenDemo }) {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-12 overflow-hidden">
      {/* 1. Cinematic Background Layer extending full width edge-to-edge across all viewports */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {/* The authentic cosmic wallpaper - full viewport width on mobile, tablet & desktop */}
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center sm:bg-right lg:bg-center opacity-45 mix-blend-screen"
          style={{
            backgroundImage: "url('/assets/cosmic-bg.jpg')",
            backgroundRepeat: 'no-repeat',
          }}
        />

        {/* Soft Left-to-Right / Center Gradient ensuring text contrast & readability */}
        <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-[#020609] via-[#020609]/85 to-transparent w-full lg:w-3/4" />

        {/* Top and Bottom Vignette Fades */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020609] via-transparent to-[#020609]" />

        {/* Ambient Radial Glows across all screen sizes */}
        <div className="absolute top-1/4 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-[#00D4FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/3 w-64 sm:w-80 h-64 sm:h-80 bg-[#00F59B]/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Eyebrow, Main Headline, Description, CTAs, Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-center text-left"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.08] backdrop-blur-md w-fit mb-6 shadow-[0_0_15px_rgba(0,245,155,0.1)]">
              <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse shadow-[0_0_8px_#00F59B]" />
              <span className="text-[11px] font-mono font-bold tracking-widest text-gray-300 uppercase">
                LEARN · PRACTICE · TRADE · GROW
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.08] font-sans">
              Your Journey <br />
              Into Crypto <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F59B] via-[#26f5ac] to-[#00D4FF] drop-shadow-[0_0_35px_rgba(0,245,155,0.45)]">
                Starts Here.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-xl font-sans font-normal leading-relaxed">
              A modern, risk-free way to learn cryptocurrency, practice trading,
              and build real skills for the future.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/register"
                className="px-7 py-3.5 rounded-full bg-[#00F59B] text-black font-extrabold text-sm sm:text-base shadow-[0_0_25px_rgba(0,245,155,0.45)] hover:shadow-[0_0_40px_rgba(0,245,155,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 group"
              >
                <span>Start Learning Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={onOpenDemo}
                className="px-6 py-3.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.15] hover:border-white/30 text-white font-bold text-sm sm:text-base backdrop-blur-md transition-all flex items-center gap-2 group"
              >
                <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-[#00F59B] group-hover:text-black transition-colors">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* 4 Small Benefit Indicators */}
            <div className="mt-10 pt-8 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-4 gap-4">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.label} className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                      <Icon className={`w-3.5 h-3.5 ${b.color}`} />
                    </div>
                    <span className="text-xs font-semibold text-gray-300 font-sans tracking-wide">
                      {b.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: 3D Crypto Scene, HUD Floating Market Cards, Vertical Tagline */}
          <div className="lg:col-span-5 relative flex flex-col sm:flex-row items-center justify-center pt-6 sm:pt-0">
            
            {/* The 3D Three.js Visual Scene (or optimized mobile illustration) */}
            <div className="relative w-full flex items-center justify-center">
              <CryptoScene />

              {/* Floating Glass HUD Market Cards - repositioned and scaled gracefully for mobile */}
              {/* BTC Card */}
              <div className="absolute top-2 left-0 sm:-top-4 sm:left-4 z-20 pointer-events-auto scale-[0.82] sm:scale-100 origin-top-left">
                <MarketCard
                  symbol="BTC"
                  name="Bitcoin"
                  price="$67,432"
                  change="+2.4%"
                  color="#00F59B"
                  delay={0.2}
                />
              </div>

              {/* ETH Card */}
              <div className="absolute top-1/3 right-0 sm:top-8 sm:right-2 z-20 pointer-events-auto scale-[0.82] sm:scale-100 origin-top-right">
                <MarketCard
                  symbol="ETH"
                  name="Ethereum"
                  price="$3,245"
                  change="+1.8%"
                  color="#627EEA"
                  delay={0.4}
                />
              </div>

              {/* SOL Card */}
              <div className="absolute -bottom-2 right-1 sm:-bottom-6 sm:right-12 z-20 pointer-events-auto scale-[0.82] sm:scale-100 origin-bottom-right">
                <MarketCard
                  symbol="SOL"
                  name="Solana"
                  price="$154.23"
                  change="+3.1%"
                  color="#14F195"
                  delay={0.6}
                />
              </div>
            </div>

            {/* Vertical Decorative Tagline on Far Right matching reference */}
            <div className="hidden xl:flex flex-col items-center gap-3 absolute -right-12 top-1/2 -translate-y-1/2 select-none opacity-40 hover:opacity-80 transition-opacity">
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#00D4FF] to-transparent" />
              <div className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#00D4FF] writing-vertical uppercase text-center leading-loose">
                A BRIGHTER<br />
                TOMORROW<br />
                BUILDS<br />
                BRIGHTER<br />
                PEOPLE
              </div>
              <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#00D4FF] to-transparent" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
