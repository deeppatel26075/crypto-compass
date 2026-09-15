import React from 'react';
import { motion } from 'framer-motion';

/**
 * Onboarding Progress Indicator
 * Displays current step (e.g., 01 / 04) with a smooth neon green progress bar.
 */
export default function OnboardingProgress({ currentStep, totalSteps = 4, className = '' }) {
  const percentage = Math.round((currentStep / totalSteps) * 100);
  const formattedCurrent = String(currentStep).padStart(2, '0');
  const formattedTotal = String(totalSteps).padStart(2, '0');

  return (
    <div
      className={`w-full max-w-md mx-auto mb-8 select-none ${className}`}
      role="progressbar"
      aria-valuenow={currentStep}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`Step ${currentStep} of ${totalSteps}`}
    >
      <div className="flex items-center justify-between text-xs font-mono mb-2 text-gray-400">
        <span className="text-gray-300 font-semibold tracking-wider">
          STEP <span className="text-[#00F59B]">{formattedCurrent}</span> / {formattedTotal}
        </span>
        <span className="text-gray-500 font-medium tracking-tight">
          {percentage}% COMPLETED
        </span>
      </div>

      {/* Progress Track */}
      <div className="w-full h-1.5 rounded-full bg-[#0a1420] border border-white/[0.08] overflow-hidden p-0.5">
        <motion.div
          className="h-full rounded-full bg-[#00F59B] shadow-[0_0_12px_rgba(0,245,155,0.7)]"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </div>
  );
}
