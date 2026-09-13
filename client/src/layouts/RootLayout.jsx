import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Award,
  Trophy,
  User,
  Box,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Clock,
} from 'lucide-react';

const RootLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const searchInputRef = useRef(null);

  // Global Ctrl+K / Cmd+K listener to focus top search bar
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (searchInputRef.current) {
          searchInputRef.current.focus();
          searchInputRef.current.select();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const mainNavItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/markets', label: 'Markets', icon: TrendingUp },
    { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { to: '/learn', label: 'Learn', icon: GraduationCap },
    { to: '/challenges', label: 'Challenges', icon: Award },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex bg-[#020609] text-gray-200 overflow-x-hidden font-sans">
      {/* 1. LEFT SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#050a0f]/95 border-r border-white/[0.07] backdrop-blur-2xl fixed inset-y-0 left-0 z-40 select-none">
        {/* Brand Header with Crosshair Logo */}
        <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
          <Link to="/" className="flex items-center gap-3 group">
            {/* Crosshair Compass Logo matching reference */}
            <div className="w-8 h-8 rounded-full bg-[#0a1420] border border-[#00F59B]/40 flex items-center justify-center text-[#00F59B] shadow-[0_0_15px_rgba(0,245,155,0.25)] group-hover:border-[#00F59B] transition-colors relative">
              <svg className="w-5 h-5 text-[#00F59B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="8" />
                <line x1="12" y1="2" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="22" />
                <line x1="2" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="22" y2="12" />
              </svg>
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5 font-sans">
                <span>Crypto</span>
                <span>Compass</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-[#0f1722] text-white border border-white/10'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-[#0a1118]/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0 text-gray-400" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Design System active item from Reference Image */}
          <div className="pt-2">
            <NavLink
              to="/design-system"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                  isActive || location.pathname === '/design-system'
                    ? 'bg-[#00F59B]/[0.08] border border-[#00F59B]/60 text-[#00F59B] shadow-[0_0_16px_rgba(0,245,155,0.2)]'
                    : 'text-gray-400 hover:text-[#00F59B] hover:bg-[#0a1118]/60 border border-transparent'
                }`
              }
            >
              <Box className="w-4 h-4 flex-shrink-0 text-[#00F59B]" />
              <span>Design System</span>
            </NavLink>
          </div>
        </div>

        {/* Sidebar Bottom Promotional / Educational Widget from Reference */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="rounded-xl p-3.5 bg-gradient-to-b from-[#0a1420] to-[#060c14] border border-white/[0.09] relative overflow-hidden shadow-lg">
            {/* Cosmic Sphere Illustration & Text */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-bold text-white leading-tight">
                Same Knowledge<br />
                <span className="text-[#00D4FF]">A Brighter</span> You
              </div>
              <div className="relative w-12 h-12 flex-shrink-0">
                {/* Glowing celestial orb */}
                <div className="absolute inset-1 rounded-full bg-gradient-to-tr from-[#00D4FF] via-[#1E40AF] to-[#020617] border border-[#00D4FF]/60 shadow-[0_0_12px_rgba(0,212,255,0.5)]" />
                {/* Diagonal planetary ring */}
                <div className="absolute inset-0 border border-[#00D4FF]/80 rounded-full transform -rotate-45 scale-x-125" />
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center gap-1.5 text-[10px] font-mono font-semibold text-[#00F59B]">
              <Clock className="w-3 h-3 text-[#00F59B] flex-shrink-0" />
              <span>SIMULATION / NO REAL MONEY</span>
            </div>
          </div>

          {/* Copyright notice with clean spacing */}
          <div className="mt-2.5 px-1 text-[9px] text-gray-500 font-mono leading-tight">
            © 2026 Crypto Compass<br />
            Educational simulation only.<br />
            No real money involved.
          </div>
        </div>
      </aside>

      {/* 2. MOBILE NAVIGATION DRAWER */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-[#050a0f] border-r border-white/10 p-4 flex flex-col z-10">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#00F59B]/20 border border-[#00F59B]/40 flex items-center justify-center text-[#00F59B]">
                  <Box className="w-4 h-4" />
                </div>
                <span className="font-bold text-sm text-white">Crypto Compass</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 py-4 space-y-1 overflow-y-auto">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium ${
                        isActive
                          ? 'bg-[#0f1722] text-white'
                          : 'text-gray-400 hover:text-white'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
              <div className="pt-2">
                <NavLink
                  to="/design-system"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold bg-[#00F59B]/10 border border-[#00F59B]/50 text-[#00F59B]"
                >
                  <Box className="w-4 h-4 text-[#00F59B]" />
                  <span>Design System</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT CONTAINER */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* TOP NAVIGATION BAR matching reference image */}
        <header className="h-16 sticky top-0 z-30 bg-[#050a0f]/90 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-8">
          {/* Mobile hamburger toggle (mobile only) */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-gray-400 hover:text-white rounded-lg bg-[#0a1420] border border-white/10"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-bold text-sm text-white">Crypto Compass</div>
          </div>

          {/* Search Bar matching reference image */}
          <div className="hidden sm:flex items-center w-full max-w-md relative">
            <div className="relative w-full flex items-center">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search components, colors, or anything..."
                className="w-full bg-[#0a1118]/80 text-gray-200 text-xs rounded-full pl-9 pr-16 py-2.5 border border-white/[0.09] hover:border-white/[0.18] focus:border-[#00F59B] focus:ring-1 focus:ring-[#00F59B]/30 outline-none transition-all placeholder-gray-500 font-sans"
              />
              <div className="absolute right-3 flex items-center">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-[#0d151d] border border-white/10 rounded">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Profile & Notifications Area matching reference image */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Notification Bell in Dark Glass Circle */}
            <button
              title="Notifications"
              className="relative w-9 h-9 rounded-full bg-[#0a1118]/90 border border-white/[0.09] flex items-center justify-center text-gray-300 hover:text-white hover:border-white/20 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-[#050a0f]" />
            </button>

            {/* User Profile Chip: Avatar (D in purple) + Demo User / Beginner */}
            <div className="flex items-center gap-2.5 pl-1.5 py-1 pr-2.5 rounded-full bg-[#0a1118]/70 border border-white/[0.09] hover:border-white/20 transition-colors cursor-pointer select-none">
              <div className="w-7 h-7 rounded-full bg-[#7C3AED] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]">
                D
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-bold text-white leading-tight">Demo User</div>
                <div className="text-[10px] text-gray-400 font-sans leading-tight">Beginner</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Mini Footer */}
        <footer className="px-8 py-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-500 font-mono">
          <div>Crypto Compass Design System · Phase 1</div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-[#00F59B] rounded-full" />
            <span className="text-gray-400">Learn. Practice. Understand. Improve.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RootLayout;
