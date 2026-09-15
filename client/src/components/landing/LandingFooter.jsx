import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ShieldCheck, Heart } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="relative z-20 border-t border-white/[0.08] bg-[#020609]/90 backdrop-blur-2xl text-gray-400 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-8 h-8 rounded-full bg-[#0a1420] border border-[#00F59B]/40 flex items-center justify-center text-[#00F59B] shadow-[0_0_15px_rgba(0,245,155,0.25)]">
                <Compass className="w-4 h-4 text-[#00F59B]" />
              </div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                <span>Crypto</span>
                <span className="text-[#00F59B]">Compass</span>
              </div>
            </Link>

            <p className="mt-4 text-xs text-gray-400 leading-relaxed max-w-sm">
              Crypto Compass is a beginner-first crypto education platform and
              paper-trading simulator designed to help you build real skills without risk.
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-[11px] text-gray-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B]" />
              <span>Simulation Only · Zero Financial Risk</span>
            </div>
          </div>

          {/* Column 1: Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/learn" className="hover:text-white transition-colors">
                  Academy & Lessons
                </Link>
              </li>
              <li>
                <Link to="/markets" className="hover:text-white transition-colors">
                  Market Simulator
                </Link>
              </li>
              <li>
                <Link to="/challenges" className="hover:text-white transition-colors">
                  Daily Challenges
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-white transition-colors">
                  Global Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/scenarios" className="hover:text-white transition-colors">
                  Educational Scenarios
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4">
              Resources
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <a href="#why-us" className="hover:text-white transition-colors">
                  Why Crypto Compass
                </a>
              </li>
              <li>
                <Link to="/learn" className="hover:text-white transition-colors">
                  Trading Terminology
                </Link>
              </li>
              <li>
                <Link to="/learn" className="hover:text-white transition-colors">
                  Risk Management 101
                </Link>
              </li>
              <li>
                <span className="text-gray-500 cursor-not-allowed">Community Discord (Soon)</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Philosophy */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white font-mono mb-4">
              Philosophy
            </h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="font-mono text-[#00F59B] text-[11px]">
                Learn → Practice → Trade → Analyze → Improve
              </div>
              <p className="text-[11px] leading-relaxed">
                Turning simulated trading mistakes into measurable learning opportunities.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-gray-500">
          <div>
            © 2026 Crypto Compass. Educational Simulation. No real money or cryptocurrency transactions.
          </div>

          <div className="flex items-center gap-1">
            <span>Built for responsible crypto education</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F59B] inline-block ml-1" />
          </div>
        </div>
      </div>
    </footer>
  );
}
