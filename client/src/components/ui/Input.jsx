import React, { forwardRef } from 'react';

/**
 * Modern Form Input with Neon Focus & Error States matching reference image
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
  const baseInputStyles = 'w-full bg-[#0a1118]/90 text-gray-100 placeholder-gray-500 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 outline-none border';

  let borderStyles = 'border-white/10 hover:border-white/20 focus:border-[#00F59B] focus:ring-1 focus:ring-[#00F59B]/40 focus:shadow-[0_0_15px_rgba(0,245,155,0.25)]';

  if (focused) {
    borderStyles = 'border-[#00F59B] ring-1 ring-[#00F59B]/50 shadow-[0_0_16px_rgba(0,245,155,0.3)] text-gray-100';
  } else if (error) {
    borderStyles = 'border-[#EF4444] ring-1 ring-[#EF4444]/50 shadow-[0_0_16px_rgba(239,68,68,0.3)] text-gray-100';
  } else if (disabled) {
    borderStyles = 'border-white/5 opacity-40 cursor-not-allowed bg-black/40';
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
        <p className="mt-1 text-xs text-[#EF4444] font-medium">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
