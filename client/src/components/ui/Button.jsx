import React from 'react';
import { motion } from 'framer-motion';

/**
 * Crypto Compass Button System
 * Supports primary solid neon green CTA, secondary dark glass, ghost, danger, and purple variants.
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  disabled = false,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseStyles = 'relative inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 outline-none select-none overflow-hidden cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'px-3.5 py-2 text-xs gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-[#00F59B] text-black font-extrabold hover:bg-[#00EFA3] active:bg-[#00D685] shadow-[0_0_20px_rgba(0,245,155,0.45)] hover:shadow-[0_0_28px_rgba(0,245,155,0.65)] hover:scale-[1.01] border border-[#00F59B]',
    secondary: 'bg-[#0d151d]/90 text-white font-semibold border border-white/20 hover:border-white/40 hover:bg-[#15202c] active:bg-[#0a1118]',
    ghost: 'bg-transparent text-gray-300 font-medium hover:text-white hover:bg-white/[0.06] active:bg-white/10',
    danger: 'bg-[#EF4444] text-white font-bold hover:bg-red-600 active:bg-red-700 shadow-[0_0_20px_rgba(239,68,68,0.4)] border border-red-500/50',
    purple: 'bg-[#8A2BE2] text-white font-bold hover:bg-[#9D4EDD] active:bg-[#7B1FA2] shadow-[0_0_20px_rgba(138,43,226,0.4)] border border-purple-500/50',
  };

  return (
    <motion.button
      type={type}
      whileTap={!disabled && !isLoading ? { scale: 0.97 } : {}}
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
          <span>{loadingText || children || 'Loading...'}</span>
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
