import React from 'react';

/**
 * Custom Toggle Switch Component
 */
const Toggle = ({
  checked = false,
  onChange,
  label,
  disabled = false,
  id,
}) => {
  const toggleId = id || `toggle-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <label
      htmlFor={toggleId}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none text-xs font-medium text-gray-300 ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:text-white'}`}
    >
      <div className="relative">
        <input
          type="checkbox"
          id={toggleId}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`w-9 h-5 rounded-full transition-colors duration-200 border p-0.5 ${
            checked
              ? 'bg-neon/30 border-neon/50'
              : 'bg-space-900 border-white/20'
          }`}
        >
          <div
            className={`w-3.5 h-3.5 rounded-full transition-transform duration-200 ${
              checked
                ? 'translate-x-4 bg-neon shadow-glow-neon-sm'
                : 'translate-x-0 bg-gray-400'
            }`}
          />
        </div>
      </div>
      {label && <span>{label}</span>}
    </label>
  );
};

export default Toggle;
