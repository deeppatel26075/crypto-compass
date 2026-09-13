import React from 'react';
import { Check } from 'lucide-react';

/**
 * Custom Checkbox Component
 */
const Checkbox = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  id,
}) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <label
      htmlFor={checkboxId}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none text-xs font-medium text-gray-300 ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-white'}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={checkboxId}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-4 h-4 rounded-md flex items-center justify-center transition-all duration-200 border ${
            checked
              ? 'bg-neon border-neon text-black shadow-glow-neon-sm'
              : 'bg-space-900 border-white/20 hover:border-white/40'
          }`}
        >
          {checked && <Check className="w-3 h-3 stroke-[3]" />}
        </div>
      </div>
      {label && <span>{label}</span>}
    </label>
  );
};

export default Checkbox;
