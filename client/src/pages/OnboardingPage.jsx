import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function OnboardingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#020609] flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden font-sans">
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00F59B]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10">
        {/* Brand Icon */}
        <div className="w-14 h-14 mx-auto rounded-full bg-[#0a1420] border border-[#00F59B]/40 flex items-center justify-center text-[#00F59B] shadow-[0_0_25px_rgba(0,245,155,0.35)] mb-6">
          <Compass className="w-7 h-7 text-[#00F59B]" />
        </div>

        {/* Success Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/30 text-[#00F59B] text-xs font-mono mb-4">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Authentication Successful</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Welcome, {user?.name || 'Learner'}!
        </h1>

        <p className="mt-3 text-sm text-gray-400 leading-relaxed">
          Your account has been created. Interactive personalized onboarding will be
          available in Phase 4.
        </p>

        {/* Enter Dashboard CTA */}
        <div className="mt-8">
          <Link to="/dashboard">
            <Button
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center gap-2"
            >
              <span>Enter Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* Safety Notice */}
        <div className="mt-6 text-[11px] text-gray-500 font-mono">
          Crypto Compass · Educational Simulation Only · No Real Money
        </div>
      </div>
    </div>
  );
}
