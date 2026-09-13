import React from 'react';

/**
 * Linear Progress Bar with glowing neon fill
 */
const ProgressBar = ({
  label,
  value = 0,
  max = 100,
  variant = 'green',
  showPercentage = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const variantFills = {
    green: 'bg-neon shadow-glow-neon-sm',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-400 shadow-glow-purple',
    cyan: 'bg-cyan shadow-glow-cyan',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex items-center justify-between text-xs font-medium mb-1.5">
          {label && <span className="text-gray-300">{label}</span>}
          {showPercentage && <span className="text-gray-400 font-mono">{percentage}%</span>}
        </div>
      )}

      <div className="w-full h-2 rounded-full bg-space-900 border border-white/10 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${variantFills[variant] || variantFills.green}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
