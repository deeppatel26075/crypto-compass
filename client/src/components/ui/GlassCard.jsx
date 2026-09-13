import React from 'react';

/**
 * Premium Glassmorphism Panel
 * High-performance backdrop blur, dark translucent surface, thin border and inner top highlight
 */
const GlassCard = ({
  children,
  className = '',
  hover = false,
  glow = false,
  glowColor = 'green',
  ...props
}) => {
  const glowStyles = {
    green: 'border-neon/30 shadow-glow-neon-sm',
    cyan: 'border-cyan/30 shadow-glow-cyan',
    purple: 'border-purple/30 shadow-glow-purple',
  };

  const baseClass = hover ? 'fintech-panel-hover' : 'fintech-panel';
  const glowClass = glow ? glowStyles[glowColor] || glowStyles.green : '';

  return (
    <div
      className={`rounded-2xl ${baseClass} ${glowClass} p-5 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
