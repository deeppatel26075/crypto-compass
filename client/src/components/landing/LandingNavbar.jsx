import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Search, Compass, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Learn', href: '/learn' },
  { name: 'Practice', href: '/markets' },
  { name: 'Markets', href: '/markets' },
  { name: 'Challenges', href: '/challenges' },
  { name: 'About', href: '#why-us' },
];

export default function LandingNavbar({ onOpenSearch }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#020609]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_10px_30px_rgba(0,0,0,0.6)]'
          : 'bg-transparent border-b border-white/[0.04]'
      }`}
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo matching reference */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#00F59B]/50 rounded-lg p-1">
          <div className="w-10 h-10 rounded-full bg-[#0a1420] border border-[#00F59B]/40 flex items-center justify-center text-[#00F59B] shadow-[0_0_20px_rgba(0,245,155,0.3)] group-hover:border-[#00F59B] group-hover:scale-105 transition-all">
            <Compass className="w-5 h-5 text-[#00F59B] animate-spin-slow" />
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5 font-sans">
              <span>Crypto</span>
              <span className="text-[#00F59B] drop-shadow-[0_0_12px_rgba(0,245,155,0.4)]">Compass</span>
            </div>
            <div className="text-[10px] text-gray-400 font-mono tracking-wider -mt-1 hidden sm:block">
              SIMULATOR & EDUCATION
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => (
            item.href.startsWith('#') ? (
              <a
                key={item.name}
                href={item.href}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all"
              >
                {item.name}
              </a>
            ) : (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/'}
                className={({ isActive }) =>
                  `relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    isActive
                      ? 'text-[#00F59B] font-semibold drop-shadow-[0_0_10px_rgba(0,245,155,0.5)]'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.06]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{item.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#00F59B] shadow-[0_0_8px_#00F59B]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            )
          ))}
        </div>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onOpenSearch}
            className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/[0.06] transition-all"
            title="Search"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>

          <Link
            to="/login"
            className="text-xs font-semibold text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-white/[0.05]"
          >
            Log In
          </Link>

          <Link
            to="/register"
            className="relative group overflow-hidden px-4 py-2 rounded-full bg-[#00F59B] text-black text-xs font-extrabold shadow-[0_0_20px_rgba(0,245,155,0.4)] hover:shadow-[0_0_30px_rgba(0,245,155,0.7)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <Link
            to="/register"
            className="px-3 py-1.5 rounded-full bg-[#00F59B] text-black text-xs font-bold shadow-[0_0_12px_rgba(0,245,155,0.3)]"
          >
            Start Free
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#0a1420] border border-white/10 text-gray-300 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer (Framer Motion) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-[#050a0f]/98 backdrop-blur-2xl border-b border-white/10 px-6 py-6 overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {navLinks.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/30'
                        : 'text-gray-300 hover:bg-white/5'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}

              <div className="pt-4 mt-2 border-t border-white/10 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-gray-300 border border-white/10 hover:bg-white/5"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl text-sm font-bold bg-[#00F59B] text-black shadow-[0_0_20px_rgba(0,245,155,0.4)]"
                >
                  Get Started Free
                </Link>
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-2 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00F59B]" />
                  <span>100% Risk-Free Simulation · No Real Money</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
