import React from 'react';
import { motion } from 'framer-motion';

/**
 * Crypto Compass Button System
 * Supports primary neon green CTA, secondary dark glass, ghost, and danger variants.
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-neon/50 disabled:opacity-40 disabled:cursor-not-allowed select-none overflow-hidden';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-neon text-black hover:bg-neon-400 active:bg-neon-600 shadow-glow-neon-sm hover:shadow-glow-neon',
    secondary: 'bg-space-800/80 text-white border border-white/15 hover:border-white/30 hover:bg-space-750 active:bg-space-700',
    ghost: 'bg-transparent text-gray-300 hover:text-white hover:bg-space-800/60 active:bg-space-750',
    danger: 'bg-error text-white hover:bg-red-600 active:bg-red-700 shadow-glow-error',
    purple: 'bg-purple text-white hover:bg-purple-400 active:bg-purple-600 shadow-glow-purple',
  };

  return (
    <motion.button
      type={type}
      whileTap={!disabled && !isLoading ? { scale: 0.98 } : {}}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
          <span>{children}</span>
          {IconRight && <IconRight className="w-4 h-4 flex-shrink-0" />}
        </>
      )}
    </motion.button>
  );
};

export default Button;
