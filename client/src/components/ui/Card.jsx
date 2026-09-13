import React from 'react';

/**
 * Standard Surface Card Component
 * Minimal dark card with subtle border
 */
const Card = ({ children, className = '', ...props }) => {
  return (
    <div
      className={`rounded-2xl bg-space-850/90 border border-white/[0.08] p-5 shadow-glass-panel ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
