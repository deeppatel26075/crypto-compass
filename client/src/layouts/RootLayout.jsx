import React from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Compass, ShieldCheck } from 'lucide-react';

const RootLayout = () => {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/markets', label: 'Markets' },
    { to: '/portfolio', label: 'Portfolio' },
    { to: '/learn', label: 'Learn' },
    { to: '/challenges', label: 'Challenges' },
    { to: '/leaderboard', label: 'Leaderboard' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-gray-200">
      {/* Simulation Safety Top Banner */}
      <div className="bg-dark-900 border-b border-dark-750 px-4 py-1.5 text-center text-xs font-mono text-gray-400 flex items-center justify-center gap-2">
        <ShieldCheck className="w-3.5 h-3.5 text-neon-green" />
        <span>SIMULATION ENVIRONMENT — NO REAL MONEY · VIRTUAL PAPER TRADING ONLY</span>
      </div>

      {/* Main Top Navigation Header */}
      <header className="sticky top-0 z-50 glass-panel border-b border-dark-700/80 bg-dark-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-dark-850 border border-dark-700 flex items-center justify-center text-neon-green group-hover:border-neon-green/50 transition-colors shadow-glow-green/20">
              <Compass className="w-5 h-5 transition-transform group-hover:rotate-45 duration-300" />
            </div>
            <div>
              <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                <span>CRYPTO</span>
                <span className="text-neon-green">COMPASS</span>
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-gray-400 hidden sm:block">
                Learn · Practice · Understand · Improve
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive
                      ? 'bg-dark-800 text-neon-green border border-neon-green/20'
                      : 'text-gray-400 hover:text-gray-200 hover:bg-dark-850'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Auth & Profile Quick Links */}
          <div className="flex items-center gap-2">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-neon-green'
                    : 'text-gray-400 hover:text-white'
                }`
              }
            >
              Log in
            </NavLink>
            <NavLink
              to="/register"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-neon-green text-black hover:bg-neon-green-light transition-all shadow-glow-green/30"
            >
              Get $10k Virtual
            </NavLink>
            <NavLink
              to="/profile"
              title="Profile"
              className={({ isActive }) =>
                `w-8 h-8 rounded-lg flex items-center justify-center border text-xs font-mono transition-colors ml-1 ${
                  isActive
                    ? 'bg-neon-green/10 border-neon-green/30 text-neon-green'
                    : 'bg-dark-850 border-dark-700 text-gray-400 hover:text-white'
                }`
              }
            >
              P
            </NavLink>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <div className="md:hidden flex items-center gap-1 px-4 py-2 overflow-x-auto border-t border-dark-800 scrollbar-none">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-dark-800 text-neon-green border border-neon-green/20'
                    : 'text-gray-400 hover:text-gray-200'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-dark-800/80 bg-dark-950 py-6 text-center text-xs text-gray-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>Crypto Compass © 2026 — Educational Paper Trading Platform</div>
          <div className="text-gray-600">Foundation v1.0.0 (Phase 0)</div>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
