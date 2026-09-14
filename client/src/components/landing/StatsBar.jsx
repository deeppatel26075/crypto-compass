import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, DollarSign, BookOpen, ShieldCheck, Clock } from 'lucide-react';

const statsData = [
  {
    value: '$10K',
    label: 'Virtual Starting Balance',
    sub: 'Practice with zero risk',
    icon: DollarSign,
    color: '#00F59B',
  },
  {
    value: '100+',
    label: 'Learning Concepts',
    sub: 'Bite-sized visual modules',
    icon: BookOpen,
    color: '#00D4FF',
  },
  {
    value: 'Risk-Free',
    label: 'Practice Environment',
    sub: 'Real market conditions',
    icon: ShieldCheck,
    color: '#8A2BE2',
  },
  {
    value: '24/7',
    label: 'Learn & Practice',
    sub: 'Anytime at your pace',
    icon: Clock,
    color: '#F59E0B',
  },
];

export default function StatsBar() {
  return (
    <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7 }}
        className="rounded-3xl bg-[#08111a]/80 backdrop-blur-2xl border border-white/[0.12] p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden"
      >
        {/* Subtle Ambient Top Border Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-[#00F59B]/60 to-transparent" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.08]">
          {statsData.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex flex-col items-center lg:items-start text-center lg:text-left ${
                  idx > 0 ? 'pt-6 lg:pt-0 lg:pl-8' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center bg-white/[0.05]"
                    style={{ color: stat.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-gray-400">
                    {stat.label}
                  </span>
                </div>

                <div
                  className="text-3xl sm:text-4xl font-black font-sans tracking-tight text-white"
                  style={{ textShadow: `0 0 20px ${stat.color}40` }}
                >
                  {stat.value}
                </div>

                <div className="text-xs text-gray-400 mt-1 font-sans">
                  {stat.sub}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Educational Quote */}
        <div className="mt-8 pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 text-xs text-gray-300 italic font-sans">
            <Sparkles className="w-4 h-4 text-[#00F59B] flex-shrink-0" />
            <span>"Crypto made simple. Education for a brighter financial future."</span>
          </div>
          <div className="text-[10px] text-gray-400 font-mono tracking-wider">
            CRYPTO COMPASS SIMULATOR · PHASE 2
          </div>
        </div>
      </motion.div>
    </section>
  );
}
