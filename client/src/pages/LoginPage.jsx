import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Mail, Lock, Eye, EyeOff, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';

export default function LoginPage() {
  const { user, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect target calculation
  const defaultTarget = user?.onboarding?.completed === false ? '/onboarding' : '/dashboard';
  const from = location.state?.from?.pathname || defaultTarget;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (isAuthenticated) {
    const target = user?.onboarding?.completed === false ? '/onboarding' : from;
    return <Navigate to={target} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both your email address and password.');
      return;
    }

    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      const target = loggedInUser?.onboarding?.completed === false ? '/onboarding' : from;
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020609] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden font-sans select-none">
      {/* Subtle Background Cosmic Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#00F59B]/[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#8A2BE2]/[0.03] rounded-full blur-3xl pointer-events-none" />

      {/* Top Brand Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#00F59B]/50 rounded-full p-1"
        >
          <div className="w-11 h-11 rounded-full bg-[#0a1420] border border-[#00F59B]/40 flex items-center justify-center text-[#00F59B] shadow-[0_0_20px_rgba(0,245,155,0.25)] group-hover:border-[#00F59B] transition-all">
            <Compass className="w-6 h-6 text-[#00F59B]" />
          </div>
          <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5 font-sans">
            <span>Crypto</span>
            <span className="text-[#00F59B]">Compass</span>
          </div>
        </Link>

        <h1 className="mt-6 text-2xl sm:text-3xl font-black tracking-tight text-white font-sans">
          Welcome Back
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-400 font-sans">
          Continue your crypto journey.
        </p>
      </div>

      {/* Form Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#08111a]/85 backdrop-blur-2xl py-8 px-6 sm:px-8 shadow-[0_20px_50px_rgba(0,0,0,0.7)] rounded-3xl border border-white/[0.12] hover:border-white/[0.18] transition-all"
        >
          {/* Error Notice */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-start gap-3 text-left">
              <AlertCircle className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <div className="text-xs text-[#FCA5A5] font-sans leading-relaxed">
                {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-semibold text-gray-300 mb-1.5 font-sans"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-[#0a1420]/80 text-gray-100 text-xs sm:text-sm rounded-xl pl-10 pr-4 py-3 border border-white/[0.1] focus:border-[#00F59B] focus:ring-1 focus:ring-[#00F59B]/30 outline-none transition-all placeholder-gray-500 font-sans"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-xs font-semibold text-gray-300 mb-1.5 font-sans"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#0a1420]/80 text-gray-100 text-xs sm:text-sm rounded-xl pl-10 pr-11 py-3 border border-white/[0.1] focus:border-[#00F59B] focus:ring-1 focus:ring-[#00F59B]/30 outline-none transition-all placeholder-gray-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-200"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={loading}
                disabled={loading}
                className="w-full justify-center text-sm font-extrabold uppercase tracking-wider"
              >
                <span>{loading ? 'LOGGING IN...' : 'LOG IN →'}</span>
              </Button>
            </div>
          </form>

          {/* Secondary Link */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] text-center text-xs text-gray-400">
            <span>New to Crypto Compass? </span>
            <Link
              to="/register"
              className="text-[#00F59B] hover:underline font-semibold transition-colors"
            >
              Create an account
            </Link>
          </div>
        </motion.div>

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
