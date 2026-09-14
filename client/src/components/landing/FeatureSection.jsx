import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, TrendingUp, Trophy, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import FeatureCard from './FeatureCard';

const features = [
  {
    icon: BookOpen,
    title: 'Learn at Your Pace',
    description: 'Simple, structured lessons from crypto basics to advanced trading psychology.',
    accentColor: '#00D4FF',
    to: '/learn',
  },
  {
    icon: TrendingUp,
    title: 'Practice Trading',
    description: 'Risk-free simulator with real-time market data and $10,000 in virtual funds.',
    accentColor: '#00F59B',
    to: '/markets',
  },
  {
    icon: Trophy,
    title: 'Complete Challenges',
    description: 'Build real-world skills through guided market scenarios and earn achievement badges.',
    accentColor: '#F59E0B',
    to: '/challenges',
  },
  {
    icon: Users,
    title: 'Join a Global Community',
    description: 'Learn, compete on leaderboards, and grow alongside thousands of crypto beginners.',
    accentColor: '#8A2BE2',
    to: '/leaderboard',
  },
];

export default function FeatureSection() {
  return (
    <section id="why-us" className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF]" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#00D4FF] uppercase">
              WHY CRYPTO COMPASS
            </span>
          </div>

          {/* Heading */}
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-sans">
            More Than a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F59B] to-[#00D4FF] drop-shadow-[0_0_20px_rgba(0,245,155,0.3)]">
              Trading Platform
            </span>
          </h2>

          {/* Description */}
          <p className="mt-4 text-base text-gray-400 max-w-2xl font-sans">
            We combine education, simulation, and real market data to help you learn,
            practice, and grow — completely without financial risk.
          </p>
        </div>

        {/* Explore Button on the right */}
        <Link
          to="/learn"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.15] hover:border-[#00F59B]/50 text-white hover:text-[#00F59B] text-xs font-bold transition-all flex-shrink-0 group"
        >
          <span>Explore All Features</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-[#00F59B]" />
        </Link>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
            accentColor={feature.accentColor}
            to={feature.to}
            delay={idx * 0.1}
          />
        ))}
      </div>
    </section>
  );
}
