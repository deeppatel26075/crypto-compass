import React, { useEffect, useState } from 'react';
import { Compass, Sparkles, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';

/**
 * Reusable placeholder card for Phase 0 scaffolding.
 * Shows upcoming phase details and tests the live backend health connection.
 */
const PlaceholderCard = ({ title, phase, description, icon: Icon = Sparkles }) => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const testHealthCheck = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.get('/health');
      setHealthStatus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    testHealthCheck();
  }, []);

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="glass-panel rounded-2xl p-8 border border-dark-700 shadow-glass relative overflow-hidden">
        {/* Subtle background glow effect */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-neon-green/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyan-accent/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-dark-800 border border-dark-700 text-neon-green">
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-xs font-mono font-semibold tracking-wider uppercase text-neon-green px-2.5 py-1 bg-neon-green/10 rounded-full border border-neon-green/20">
              {phase}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">
            {title}
          </h1>

          <p className="text-gray-400 text-base leading-relaxed mb-8">
            {description}
          </p>

          {/* Backend Connectivity Status Box */}
          <div className="rounded-xl bg-dark-900/80 border border-dark-750 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Compass className="w-3.5 h-3.5 text-cyan-accent" />
                Backend API Status (/api/health)
              </span>
              <button
                onClick={testHealthCheck}
                disabled={loading}
                title="Refresh API status"
                className="text-gray-400 hover:text-neon-green transition-colors p-1"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {loading ? (
              <div className="flex items-center gap-2 text-xs font-mono text-gray-400 py-1">
                <div className="w-2 h-2 rounded-full bg-amber-accent animate-pulse" />
                Querying backend health endpoint...
              </div>
            ) : error ? (
              <div className="flex items-center gap-2 text-xs font-mono text-rose-accent py-1">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>Backend offline or unreachable ({error})</span>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-neon-green">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  <span>{healthStatus?.message || 'API is online'}</span>
                </div>
                <div className="text-[11px] font-mono text-gray-500 pl-6">
                  MongoDB: <span className="text-gray-300">{healthStatus?.database}</span> · Base URL: <span className="text-gray-400">{import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderCard;
