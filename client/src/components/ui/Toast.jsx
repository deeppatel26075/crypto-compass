import React from 'react';
import { CheckCircle2, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

/**
 * Toast Notification Component
 */
const Toast = ({
  type = 'success',
  title = 'Success',
  message = 'Action completed!',
  onClose,
  className = '',
}) => {
  const configs = {
    success: {
      border: 'border-emerald-500/40 shadow-glow-neon-sm',
      bg: 'bg-space-900/90',
      icon: CheckCircle2,
      iconColor: 'text-emerald-400',
    },
    info: {
      border: 'border-cyan/40 shadow-glow-cyan/20',
      bg: 'bg-space-900/90',
      icon: Info,
      iconColor: 'text-cyan-accent',
    },
    warning: {
      border: 'border-amber-500/40 shadow-glow-gold/20',
      bg: 'bg-space-900/90',
      icon: AlertTriangle,
      iconColor: 'text-amber-400',
    },
    error: {
      border: 'border-rose-500/40 shadow-glow-error/20',
      bg: 'bg-space-900/90',
      icon: AlertCircle,
      iconColor: 'text-rose-400',
    },
  };

  const config = configs[type] || configs.success;
  const Icon = config.icon;

  return (
    <div
      className={`rounded-xl border ${config.border} ${config.bg} p-3 flex items-start gap-2.5 backdrop-blur-md transition-all ${className}`}
    >
      <div className={`p-1 rounded-lg ${config.iconColor} flex-shrink-0 mt-0.5`}>
        <Icon className="w-4 h-4" />
      </div>

      <div className="flex-1 min-w-0 pr-1">
        <div className="text-xs font-bold text-white leading-tight">{title}</div>
        <div className="text-[11px] text-gray-400 leading-snug mt-0.5 truncate">{message}</div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-white p-0.5 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};

export default Toast;
