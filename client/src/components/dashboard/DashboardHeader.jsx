import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

const DashboardHeader = ({ user }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date());

  const firstName = user?.name ? user.name.split(' ')[0] : 'Learner';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-sans">
            {getGreeting()}, {firstName} 👋
          </h1>
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 text-[11px] font-mono text-[#00F59B]">
            <Sparkles className="w-3 h-3" />
            Active Learner
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-400 font-sans">
          Welcome to your learning command center. Build your foundation and track your progress.
        </p>
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-xl bg-[#0a1420]/80 border border-white/[0.08] text-xs font-mono text-gray-400">
        <Calendar className="w-3.5 h-3.5 text-[#00F59B]" />
        <span>{formattedDate}</span>
      </div>
    </div>
  );
};

export default DashboardHeader;
