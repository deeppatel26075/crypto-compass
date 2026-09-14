import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, ShieldCheck, TrendingUp, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DemoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-2xl rounded-3xl bg-[#070e17] border border-white/[0.15] shadow-[0_25px_70px_rgba(0,0,0,0.8)] p-6 sm:p-8 z-10 overflow-hidden"
        >
          {/* Top Accent Line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00D4FF] via-[#00F59B] to-[#8A2BE2]" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-gray-400 hover:text-white transition-colors"
            aria-label="Close demo modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#00F59B]">
              SIMULATION PLATFORM PREVIEW
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-sans">
            How Crypto Compass Works
          </h2>
          <p className="text-sm text-gray-400 mt-1 font-sans">
            Experience our 4-step risk-free educational journey.
          </p>

          {/* Interactive Steps Preview */}
          <div className="mt-6 space-y-3">
            {[
              {
                step: '01',
                title: 'Get $10,000 Virtual Funds',
                desc: 'Instantly receive simulation capital to trade Bitcoin, Ethereum, and altcoins without risking real cash.',
                icon: ShieldCheck,
                color: 'text-[#00F59B]',
              },
              {
                step: '02',
                title: 'Practice with Real Market Data',
                desc: 'Observe live market fluctuations, practice executing limit and market orders in realistic conditions.',
                icon: TrendingUp,
                color: 'text-[#00D4FF]',
              },
              {
                step: '03',
                title: 'Learn from Every Trade',
                desc: 'Review automated behavioral feedback that highlights emotional trading, over-leveraging, and risk habits.',
                icon: Sparkles,
                color: 'text-[#8A2BE2]',
              },
              {
                step: '04',
                title: 'Level Up & Earn Skills',
                desc: 'Complete structured interactive lessons and climb the simulated leaderboards with confidence.',
                icon: CheckCircle2,
                color: 'text-[#F59E0B]',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/[0.05] flex items-center justify-center font-mono text-xs font-bold text-gray-300">
                    {item.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${item.color}`} />
                      <h4 className="text-sm font-bold text-white font-sans">{item.title}</h4>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Footer CTA */}
          <div className="mt-7 pt-5 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-gray-400 font-mono">
              Ready to start your risk-free crypto journey?
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full text-xs font-semibold text-gray-400 hover:text-white transition-colors"
              >
                Close
              </button>
              <Link
                to="/register"
                onClick={onClose}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-[#00F59B] text-black text-xs font-extrabold shadow-[0_0_20px_rgba(0,245,155,0.4)] hover:shadow-[0_0_30px_rgba(0,245,155,0.7)] transition-all flex items-center justify-center gap-1.5"
              >
                <span>Get Started Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
