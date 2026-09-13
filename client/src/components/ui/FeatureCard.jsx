import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

/**
 * FeatureCard Component
 * Showcases educational modules, features, or tools with icon, title, description, and link action.
 */
const FeatureCard = ({
  title,
  description,
  icon: Icon = Sparkles,
  badgeText,
  className = '',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl fintech-panel-hover p-4 flex flex-col justify-between cursor-pointer group ${className}`}
    >
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="w-8 h-8 rounded-xl bg-neon/10 border border-neon/20 flex items-center justify-center text-neon group-hover:shadow-glow-neon-sm transition-all">
            <Icon className="w-4 h-4" />
          </div>
          {badgeText && (
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-space-800 text-gray-400 border border-white/10">
              {badgeText}
            </span>
          )}
        </div>
        <h4 className="text-xs font-bold text-white mb-1 group-hover:text-neon transition-colors">
          {title}
        </h4>
        <p className="text-[11px] text-gray-400 leading-snug">
          {description}
        </p>
      </div>

      <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-gray-500 group-hover:text-neon transition-colors">
        <span>Explore</span>
        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

export default FeatureCard;
