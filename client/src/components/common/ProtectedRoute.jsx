import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../ui/Spinner';

export default function ProtectedRoute({
  children,
  requireAccess = true,
  requireOnboardingComplete = true,
}) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020609] flex flex-col items-center justify-center text-gray-200">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="#00F59B" />
          <div className="text-xs font-mono text-gray-400 tracking-wider">
            Verifying session...
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Phase 26: Virtual Access Gate check
  // If user does not have access unlocked, redirect to /access
  const isAccessUnlocked = user?.access?.unlocked === true;
  if (requireAccess && !isAccessUnlocked) {
    return <Navigate to="/access" replace />;
  }

  // If on /access page but already unlocked, redirect onward
  if (!requireAccess && isAccessUnlocked && location.pathname === '/access') {
    const nextRoute = user?.onboarding?.completed ? '/dashboard' : '/onboarding';
    return <Navigate to={nextRoute} replace />;
  }

  const isOnboardingCompleted = user?.onboarding?.completed === true;

  // Protected application routes require onboarding to be completed
  if (requireOnboardingComplete && !isOnboardingCompleted) {
    return <Navigate to="/onboarding" replace />;
  }

  // Onboarding route itself: if already completed, redirect to dashboard
  if (!requireOnboardingComplete && isOnboardingCompleted && location.pathname === '/onboarding') {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? children : <Outlet />;
}
