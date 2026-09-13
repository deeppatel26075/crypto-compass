import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Icon Button for fintech actions (charts, search, notifications, modal close)
 */
const IconButton = ({
  icon: Icon,
  variant = 'default',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  title,
  ...props
}) => {
  const sizeStyles = {
    sm: 'w-8 h-8 p-1.5',
    md: 'w-10 h-10 p-2.5',
    lg: 'w-12 h-12 p-3',
  };

  const variantStyles = {
    default: 'bg-space-800/80 text-gray-300 border border-white/10 hover:text-neon hover:border-neon/40 hover:bg-space-750',
    active: 'bg-neon/10 text-neon border border-neon/40 shadow-glow-neon-sm',
    ghost: 'bg-transparent text-gray-400 hover:text-white hover:bg-space-800/50',
  };

  return (
    <motion.button
      whileTap={!disabled ? { scale: 0.94 } : {}}
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`inline-flex items-center justify-center rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-neon/40 disabled:opacity-40 disabled:cursor-not-allowed ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-full h-full" />}
    </motion.button>
  );
};

export default IconButton;
