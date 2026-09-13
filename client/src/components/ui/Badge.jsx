import React from 'react';

/**
 * Reusable Badge & Tag Component
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm',
  };

  const variantStyles = {
    // Category pills (Filled dark translucence with accent)
    new: 'bg-purple/20 text-purple-400 border border-purple/40',
    popular: 'bg-cyan/20 text-cyan-accent border border-cyan/40',
    learning: 'bg-neon/15 text-neon border border-neon/30',

    // Difficulty / Level Tags
    beginner: 'bg-space-800 text-gray-300 border border-white/10',
    intermediate: 'bg-space-850 text-cyan-accent border border-cyan/40 shadow-glow-cyan/10',
    advanced: 'bg-space-850 text-purple-400 border border-purple/40 shadow-glow-purple/10',

    // Status Badges
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
    error: 'bg-rose-500/10 text-rose-400 border border-rose-500/30',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/30',

    default: 'bg-space-800 text-gray-300 border border-white/10',
  };

  const dotColors = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    error: 'bg-rose-400',
    info: 'bg-blue-400',
    learning: 'bg-neon',
    new: 'bg-purple-400',
    popular: 'bg-cyan',
    default: 'bg-gray-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.default} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`}
        />
      )}
      <span>{children}</span>
    </span>
  );
};

export default Badge;
