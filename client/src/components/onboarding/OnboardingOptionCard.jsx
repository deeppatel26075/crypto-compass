import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

/**
 * OnboardingOptionCard
 * Premium selectable glassmorphic card for onboarding choices.
 * Supports full keyboard navigation (Enter/Space), hover glow, and selected state.
 */
export default function OnboardingOptionCard({
  id,
  title,
  description,
  icon: Icon,
  badgeText,
  isSelected,
  onSelect,
  className = '',
}) {
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onSelect(id);
    }
  };

  return (
    <motion.div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onSelect(id)}
      onKeyDown={handleKeyDown}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className={`relative w-full p-4 sm:p-5 rounded-2xl cursor-pointer select-none outline-none transition-all duration-200 text-left border ${
        isSelected
          ? 'bg-[#00F59B]/[0.07] border-[#00F59B] shadow-[0_0_25px_rgba(0,245,155,0.22)]'
          : 'bg-[#08111a]/70 hover:bg-[#0c1824]/90 border-white/[0.08] hover:border-white/[0.18]'
      } focus-visible:ring-2 focus-visible:ring-[#00F59B]/70 ${className}`}
    >
      <div className="flex items-start gap-3.5 sm:gap-4">
        {/* Leading Icon / Badge */}
        {Icon && (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
              isSelected
                ? 'bg-[#00F59B]/20 border border-[#00F59B]/60 text-[#00F59B]'
                : 'bg-[#0d1722] border border-white/[0.08] text-gray-400 group-hover:text-gray-200'
            }`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={`text-sm sm:text-base font-bold tracking-tight font-sans transition-colors ${
                isSelected ? 'text-white font-extrabold' : 'text-gray-200'
              }`}
            >
              {title}
            </h3>

            {badgeText && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/[0.06] text-gray-400 border border-white/[0.08]">
                {badgeText}
              </span>
            )}
          </div>

          {description && (
            <p className="mt-1 text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
              {description}
            </p>
          )}
        </div>

        {/* Selected Checkmark Indicator */}
        <div
          className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            isSelected
              ? 'bg-[#00F59B] text-black shadow-[0_0_10px_rgba(0,245,155,0.6)]'
              : 'border border-white/[0.16] bg-black/20 text-transparent'
          }`}
          aria-hidden="true"
        >
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        </div>
      </div>
    </motion.div>
  );
}
