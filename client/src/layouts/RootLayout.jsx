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
  Palette,
  Search,
  Bell,
  ChevronDown,
  Menu,
  X,
  Compass,
  Clock,
  ShieldCheck,
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
    <div className="min-h-screen flex bg-space-950 text-gray-200 overflow-x-hidden">
      {/* 1. LEFT SIDEBAR (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-space-950/90 border-r border-white/[0.07] backdrop-blur-2xl fixed inset-y-0 left-0 z-40 select-none">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-6 border-b border-white/[0.06]">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-full bg-space-850 border border-neon/30 flex items-center justify-center text-neon shadow-glow-neon-sm group-hover:border-neon transition-colors">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center gap-1">
                <span>Crypto</span>
                <span className="text-neon">Compass</span>
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
                      ? 'bg-space-800 text-white border border-white/10'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-space-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Special Showcase Link: Design System (Active highlight matching reference image) */}
          <div className="pt-2">
            <NavLink
              to="/design-system"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive || location.pathname === '/design-system'
                    ? 'sidebar-active-glow text-neon'
                    : 'text-gray-400 hover:text-neon hover:bg-space-900/60 border border-transparent'
                }`
              }
            >
              <Palette className="w-4 h-4 flex-shrink-0 text-neon" />
              <span>Design System</span>
            </NavLink>
          </div>
        </div>

        {/* Sidebar Bottom Promotional / Educational Widget from Reference */}
        <div className="p-3 border-t border-white/[0.06]">
          <div className="rounded-xl p-3 bg-gradient-to-b from-space-850 to-space-900 border border-white/[0.08] relative overflow-hidden">
            {/* Cosmic Sphere Illustration */}
            <div className="flex items-center justify-between mb-2">
              <div className="text-[11px] font-bold text-white leading-tight">
                Same<br />Knowledge<br /><span className="text-cyan-accent">A Brighter</span><br />You
              </div>
              <div className="relative w-12 h-12 flex-shrink-0">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-accent to-purple opacity-70 blur-[3px]" />
                <div className="absolute inset-1 rounded-full bg-[#051124] border border-cyan/40" />
                <div className="absolute inset-0 border border-cyan/60 rounded-full transform -rotate-45 scale-x-125" />
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center gap-1.5 text-[10px] font-mono text-neon">
              <Clock className="w-3 h-3 text-neon" />
              <span>SIMULATION / NO REAL MONEY</span>
            </div>
          </div>

          {/* Copyright notice */}
          <div className="mt-2 px-1 text-[9px] text-gray-500 font-mono leading-tight">
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
          <div className="fixed inset-y-0 left-0 w-64 bg-space-950 border-r border-white/10 p-4 flex flex-col z-10">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-neon/20 border border-neon/40 flex items-center justify-center text-neon">
                  <Compass className="w-4 h-4" />
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
                          ? 'bg-space-800 text-white'
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
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold sidebar-active-glow text-neon"
                >
                  <Palette className="w-4 h-4 text-neon" />
                  <span>Design System</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN CONTENT CONTAINER (Padded for Desktop Sidebar) */}
      <div className="flex-1 flex flex-col lg:pl-64 min-w-0">
        {/* TOP NAVIGATION BAR */}
        <header className="h-16 sticky top-0 z-30 bg-space-950/80 backdrop-blur-xl border-b border-white/[0.06] flex items-center justify-between px-4 sm:px-8">
          {/* Mobile hamburger toggle & brand (mobile only) */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 text-gray-400 hover:text-white rounded-lg bg-space-850 border border-white/10"
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
                className="w-full bg-space-900/80 text-gray-200 text-xs rounded-full pl-9 pr-16 py-2 border border-white/[0.08] hover:border-white/[0.16] focus:border-neon focus:ring-1 focus:ring-neon/30 outline-none transition-all placeholder-gray-500"
              />
              <div className="absolute right-3 flex items-center">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-space-800 border border-white/10 rounded">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Profile & Notifications Area */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* Notification Bell with red unread dot */}
            <button
              title="Notifications"
              className="relative p-2 rounded-full bg-space-900/80 border border-white/[0.08] text-gray-300 hover:text-white hover:border-white/20 transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-error ring-2 ring-space-950" />
            </button>

            {/* User Profile Chip */}
            <div className="flex items-center gap-2.5 pl-2 py-1 pr-2 rounded-full bg-space-900/60 border border-white/[0.08] hover:border-white/20 transition-colors cursor-pointer select-none">
              <div className="w-7 h-7 rounded-full bg-purple flex items-center justify-center text-xs font-bold text-white shadow-glow-purple/40">
                D
              </div>
              <div className="hidden md:block text-left">
                <div className="text-xs font-semibold text-white leading-tight">Demo User</div>
                <div className="text-[10px] text-gray-400 font-mono leading-tight">Beginner</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Mini Footer with Tagline matching reference bottom line */}
        <footer className="px-8 py-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-500 font-mono">
          <div>Crypto Compass Design System · Phase 1</div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-neon rounded-full" />
            <span className="text-gray-400">Learn. Practice. Understand. Improve.</span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RootLayout;
