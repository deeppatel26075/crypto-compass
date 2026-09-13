import React, { forwardRef } from 'react';

/**
 * Modern Form Input with Neon Focus & Error States
 */
const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  iconRight: IconRight,
  className = '',
  disabled = false,
  focused = false,
  ...props
}, ref) => {
  const baseInputStyles = 'w-full bg-space-900/90 text-gray-100 placeholder-gray-500 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 outline-none border';

  let borderStyles = 'border-white/10 hover:border-white/20 focus:border-neon focus:ring-1 focus:ring-neon/40';

  if (focused) {
    borderStyles = 'border-neon ring-1 ring-neon/40 shadow-glow-neon-sm';
  } else if (error) {
    borderStyles = 'border-error ring-1 ring-error/40 shadow-glow-error';
  } else if (disabled) {
    borderStyles = 'border-white/5 opacity-50 cursor-not-allowed bg-space-950/60';
  }

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-gray-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}

        <input
          ref={ref}
          disabled={disabled}
          className={`${baseInputStyles} ${borderStyles} ${Icon ? 'pl-9' : ''} ${IconRight ? 'pr-9' : ''} ${className}`}
          {...props}
        />

        {IconRight && (
          <div className="absolute right-3 text-gray-400 pointer-events-none">
            <IconRight className="w-4 h-4" />
          </div>
        )}
      </div>

      {error && (
        <p className="mt-1 text-xs text-error font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
