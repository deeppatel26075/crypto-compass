import React from 'react';

/**
 * Sleek Circular Spinner with Neon Gradient Tail
 */
const Spinner = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-5 h-5 border-2',
    md: 'w-7 h-7 border-[2.5px]',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        className={`rounded-full border-t-neon border-r-neon/30 border-b-white/5 border-l-white/5 animate-spin ${sizeMap[size] || sizeMap.md}`}
        style={{ animationDuration: '0.8s' }}
      />
    </div>
  );
};

export default Spinner;
