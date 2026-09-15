import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, TrendingUp, Briefcase, ChevronRight } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: 'Academy & Lessons',
      desc: 'Master crypto basics & strategies',
      to: '/learn',
      icon: GraduationCap,
      color: 'text-[#00F59B]',
      bg: 'bg-[#00F59B]/10',
      border: 'border-[#00F59B]/30',
    },
    {
      title: 'Market Overview',
      desc: 'Explore mock tokens & chart stats',
      to: '/markets',
      icon: TrendingUp,
      color: 'text-[#00D4FF]',
      bg: 'bg-[#00D4FF]/10',
      border: 'border-[#00D4FF]/30',
    },
    {
      title: 'Virtual Portfolio',
      desc: 'Inspect cash balance & allocations',
      to: '/portfolio',
      icon: Briefcase,
      color: 'text-[#8A2BE2]',
      bg: 'bg-[#8A2BE2]/10',
      border: 'border-[#8A2BE2]/30',
    },
  ];

  return (
    <div className="w-full rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] p-6 sm:p-7 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.3)] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase">
            NAVIGATION
          </span>
          <span className="text-[11px] font-mono text-[#00F59B]">Quick Access</span>
        </div>
        <h3 className="text-base font-bold text-white font-sans mb-3">
          Explore Platform
        </h3>

        <div className="space-y-2.5">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <Link
                key={act.to}
                to={act.to}
                className="p-3 rounded-xl bg-[#050e18]/80 border border-white/[0.06] hover:border-white/[0.16] hover:bg-[#081524]/80 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg border ${act.border} ${act.bg} ${act.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-sans group-hover:text-[#00F59B] transition-colors">
                      {act.title}
                    </div>
                    <div className="text-[11px] text-gray-400 font-sans">
                      {act.desc}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-white/[0.06] text-[11px] font-mono text-gray-500">
        Paper-trading simulation workspace
      </div>
    </div>
  );
};

export default QuickActions;
