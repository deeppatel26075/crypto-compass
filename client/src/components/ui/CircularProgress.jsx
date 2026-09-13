import React from 'react';

/**
 * Circular Progress Meter with SVG stroke and neon glow
 */
const CircularProgress = ({
  value = 75,
  size = 68,
  strokeWidth = 5,
  className = '',
}) => {
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Animated neon progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#00F59B"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(0, 245, 155, 0.45))',
            transition: 'stroke-dashoffset 0.6s ease',
          }}
        />
      </svg>
      {/* Centered percentage text */}
      <div className="absolute text-xs font-bold font-mono text-white">
        {value}%
      </div>
    </div>
  );
};

export default CircularProgress;
