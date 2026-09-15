import React from 'react';
import { Target, Compass, BookOpen, Activity } from 'lucide-react';

const GOAL_LABELS = {
  crypto_fundamentals: 'Crypto Fundamentals',
  practice_trading: 'Paper Trading Prep',
  technical_analysis: 'Technical Analysis',
  risk_management: 'Risk Management',
  trading_discipline: 'Trading Discipline',
};

const EXPERIENCE_LABELS = {
  beginner: 'Beginner',
  curious: 'Curious Explorer',
  practice_trader: 'Practice Trader',
  experienced: 'Experienced',
};

const STYLE_LABELS = {
  short_lessons: 'Short Lessons',
  scenarios: 'Scenario Simulations',
  quizzes: 'Interactive Quizzes',
  practice: 'Hands-on Practice',
};

const DashboardStatCards = ({ user }) => {
  const onboarding = user?.onboarding || {};
  const goal = GOAL_LABELS[onboarding.primaryGoal] || 'Fundamentals';
  const experience = EXPERIENCE_LABELS[onboarding.experienceLevel] || 'Beginner';
  const style = STYLE_LABELS[onboarding.learningStyle] || 'Interactive';

  const stats = [
    {
      label: 'PRIMARY GOAL',
      value: goal,
      subtext: 'Curriculum Focus',
      icon: Target,
      color: 'text-[#00F59B]',
      border: 'border-[#00F59B]/20',
      bg: 'bg-[#00F59B]/10',
    },
    {
      label: 'EXPERIENCE LEVEL',
      value: experience,
      subtext: 'Personalized Track',
      icon: Compass,
      color: 'text-[#00D4FF]',
      border: 'border-[#00D4FF]/20',
      bg: 'bg-[#00D4FF]/10',
    },
    {
      label: 'LEARNING STYLE',
      value: style,
      subtext: 'Preferred Format',
      icon: BookOpen,
      color: 'text-[#8A2BE2]',
      border: 'border-[#8A2BE2]/20',
      bg: 'bg-[#8A2BE2]/10',
    },
    {
      label: 'ACCOUNT STATUS',
      value: 'Simulated',
      subtext: 'Risk-Free Environment',
      icon: Activity,
      color: 'text-[#F59E0B]',
      border: 'border-[#F59E0B]/20',
      bg: 'bg-[#F59E0B]/10',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] p-4 sm:p-5 backdrop-blur-xl hover:border-white/[0.16] transition-all flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase">
                {stat.label}
              </span>
              <div className={`p-2 rounded-xl border ${stat.border} ${stat.bg} ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold text-white tracking-tight font-sans truncate" title={stat.value}>
                {stat.value}
              </div>
              <div className="text-xs text-gray-400 font-sans mt-0.5">
                {stat.subtext}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStatCards;
