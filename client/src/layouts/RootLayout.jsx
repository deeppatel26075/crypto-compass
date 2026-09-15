import React, { useState, useEffect, useRef } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  TrendingUp,
  Briefcase,
  GraduationCap,
  Compass,
  Calculator,
  Activity,
  Award,
  Trophy,
  User,
  Box,
  Search,
  ChevronDown,
  Menu,
  X,
  Clock,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import GlobalSearchModal from '../components/common/GlobalSearchModal';

const RootLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const userMenuRef = useRef(null);

  // Global Ctrl+K / Cmd+K listener to open search modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Click outside to close user menu dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen]);

  const mainNavItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/markets', label: 'Markets', icon: TrendingUp },
    { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { to: '/history', label: 'History', icon: Clock },
    { to: '/learn', label: 'Learn', icon: GraduationCap },
    { to: '/scenarios', label: 'Scenarios', icon: Compass },
    { to: '/simulator', label: 'What-If Simulator', icon: Calculator },
    { to: '/analysis', label: 'Mistake Analyzer', icon: Activity },
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
        </div>

        {/* Sidebar Bottom Notice */}
        <div className="p-4 border-t border-white/[0.06]">
          <div className="px-1 text-[10px] text-gray-500 font-mono leading-relaxed">
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
              aria-label="Open mobile menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-bold text-sm text-white">Crypto Compass</div>
            
            {/* Mobile Search Button */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className="p-2 text-gray-400 hover:text-white rounded-lg bg-[#0a1420] border border-white/10 ml-auto"
              title="Search"
              aria-label="Search"
            >
              <Search className="w-4 h-4 text-[#00F59B]" />
            </button>
          </div>

          {/* Search Bar with instant GlobalSearchModal trigger */}
          <div
            onClick={() => setSearchModalOpen(true)}
            className="hidden sm:flex items-center w-full max-w-md relative cursor-pointer group"
          >
            <div className="relative w-full flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400 group-hover:text-[#00F59B] absolute left-3.5 transition-colors" />
              <input
                type="text"
                readOnly
                placeholder="Search lessons, markets, topics... (Ctrl+K)"
                className="w-full bg-[#0a1118]/80 text-gray-200 text-xs rounded-full pl-9 pr-16 py-2.5 border border-white/[0.09] group-hover:border-white/[0.22] transition-all placeholder-gray-500 font-sans cursor-pointer"
              />
              <div className="absolute right-3 flex items-center">
                <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-[#0d151d] border border-white/10 rounded group-hover:border-white/20">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </div>

          {/* Right Profile Area (Notification icon removed per user instruction) */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            {/* User Profile Chip with Logout Dropdown */}
            <div className="relative" ref={userMenuRef}>
              <div
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2.5 pl-1.5 py-1 pr-2.5 rounded-full bg-[#0a1118]/70 border border-white/[0.09] hover:border-white/20 transition-colors cursor-pointer select-none"
              >
                <div className="w-7 h-7 rounded-full bg-[#7C3AED] flex items-center justify-center text-xs font-bold text-white shadow-[0_0_12px_rgba(124,58,237,0.4)]">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'D'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-bold text-white leading-tight">
                    {user?.name || 'Demo User'}
                  </div>
                  <div className="text-[10px] text-gray-400 font-sans leading-tight">
                    {user ? 'Learner' : 'Beginner'}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
              </div>

              {/* Dropdown Menu */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-[#08111a] border border-white/[0.12] shadow-[0_15px_35px_rgba(0,0,0,0.8)] py-2 z-50">
                  <div className="px-4 py-2 border-b border-white/[0.06]">
                    <div className="text-xs font-bold text-white truncate">
                      {user?.name || 'Demo User'}
                    </div>
                    <div className="text-[10px] text-gray-400 truncate font-mono">
                      {user?.email || 'simulation@cryptocompass.io'}
                    </div>
                  </div>
                  {user ? (
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#EF4444] hover:bg-white/[0.04] flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full px-4 py-2.5 text-left text-xs font-semibold text-[#00F59B] hover:bg-white/[0.04] flex items-center gap-2 transition-colors"
                    >
                      <span>Log In</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 px-4 sm:px-8 py-6 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </main>

        {/* Global Mini Footer */}
        <footer className="px-8 py-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-gray-500 font-mono">
          <div>Crypto Compass · Educational Simulation Platform</div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-[#00F59B] rounded-full" />
            <span className="text-gray-400">Learn. Practice. Understand. Improve.</span>
          </div>
        </footer>
      </div>

      {/* Global Command Palette / Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </div>
  );
};

export default RootLayout;
