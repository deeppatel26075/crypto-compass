import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="max-w-md mx-auto py-20 px-4 text-center">
      <div className="glass-panel rounded-2xl p-8 border border-dark-700 shadow-glass relative">
        <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-dark-700 flex items-center justify-center mx-auto mb-6 text-rose-accent">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '8s' }} />
        </div>
        <div className="text-4xl font-extrabold text-white mb-2 font-mono">404</div>
        <h1 className="text-xl font-bold text-gray-200 mb-2">Coordinates Lost</h1>
        <p className="text-gray-400 text-sm mb-6">
          The route you are looking for does not exist in the Crypto Compass simulation grid.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neon-green text-black font-semibold text-sm hover:bg-neon-green-light transition-all shadow-glow-green"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Compass
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
