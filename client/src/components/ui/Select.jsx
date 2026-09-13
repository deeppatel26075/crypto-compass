import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Custom Dark Dropdown Select
 */
const Select = forwardRef(({
  label,
  options = [],
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  error,
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-gray-300 mb-1.5">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        <select
          ref={ref}
          disabled={disabled}
          className={`w-full appearance-none bg-space-900/90 text-gray-200 rounded-xl px-3.5 py-2.5 pr-9 text-sm transition-all duration-200 outline-none border border-white/10 hover:border-white/20 focus:border-neon focus:ring-1 focus:ring-neon/40 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
          {...props}
        >
          <option value="" disabled className="bg-space-900 text-gray-400">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-space-900 text-gray-100">
              {opt.label}
            </option>
          ))}
        </select>

        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
      </div>

      {error && <p className="mt-1 text-xs text-error font-medium">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
