import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

/**
 * StatCard for Portfolio & Market metrics
 */
const StatCard = ({
  label,
  value,
  change,
  isPositive = true,
  icon: Icon = TrendingUp,
  className = '',
}) => {
  return (
    <div className={`rounded-xl bg-space-850/80 border border-white/[0.08] p-4 flex items-center justify-between ${className}`}>
      <div>
        {label && <div className="text-xs text-gray-400 font-medium mb-1">{label}</div>}
        <div className="text-xl font-bold font-mono text-white tracking-tight">{value}</div>
        {change && (
          <div className={`text-xs font-mono font-semibold flex items-center gap-1 mt-1 ${isPositive ? 'text-neon' : 'text-error'}`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{change}</span>
          </div>
        )}
      </div>

      <div className={`p-2.5 rounded-xl border ${isPositive ? 'bg-neon/10 border-neon/20 text-neon' : 'bg-error/10 border-error/20 text-error'}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};

export default StatCard;
