import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  Tag,
  ArrowRight,
  Sparkles,
  AlertCircle,
  Lock,
  Coins,
  TrendingUp,
  Award,
  GraduationCap,
  Activity,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import accessService from '../services/accessService';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

export default function AccessPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [accessData, setAccessData] = useState(null);
  const [couponInput, setCouponInput] = useState('CRYPTO100');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch current access status on mount
  useEffect(() => {
    let isMounted = true;
    const fetchStatus = async () => {
      try {
        const data = await accessService.getStatus();
        if (!isMounted) return;
        setAccessData(data);
        // If user is already unlocked, redirect onward
        if (data && data.unlocked) {
          if (user?.onboarding?.completed) {
            navigate('/dashboard', { replace: true });
          } else {
            navigate('/onboarding', { replace: true });
          }
        }
      } catch (err) {
        console.error('Failed to load access status:', err);
        setErrorMsg('Could not verify access status. Please refresh the page.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStatus();
    return () => {
      isMounted = false;
    };
  }, [navigate, user]);

  const handleApply = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const trimmed = (couponInput || '').trim();
    if (!trimmed) {
      setErrorMsg('Please enter a promotional coupon code.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await accessService.redeem(trimmed);
      setAccessData(res);
      setSuccessMsg('Virtual access unlocked successfully!');
      
      // Update session auth state
      await refreshUser();

      // Smooth transition to next step
      setTimeout(() => {
        if (user?.onboarding?.completed) {
          navigate('/dashboard', { replace: true });
        } else {
          navigate('/onboarding', { replace: true });
        }
      }, 1000);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Invalid promotional code.';
      setErrorMsg(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020609] flex flex-col items-center justify-center text-gray-200">
        <Spinner size="lg" color="#00F59B" />
        <div className="mt-4 text-xs font-mono text-gray-400 tracking-wider">
          Loading Virtual Access...
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Coins,
      title: '$10,000 Virtual Starting Balance',
      desc: 'Simulated USD paper trading funds ready in your virtual wallet.',
    },
    {
      icon: TrendingUp,
      title: 'Live Crypto Market Data',
      desc: 'Real-time prices, percentage trends, and interactive charts.',
    },
    {
      icon: Compass,
      title: 'Educational Trade Coach & Feedback',
      desc: 'Rule-based educational risk guidance on paper orders.',
    },
    {
      icon: GraduationCap,
      title: 'Interactive Lessons & Quizzes',
      desc: 'Master crypto fundamentals, technical analysis & risk management.',
    },
    {
      icon: Activity,
      title: 'Behavioral Mistake Analysis',
      desc: 'FOMO, trading cadence & position-sizing pattern detection.',
    },
    {
      icon: Award,
      title: 'Trading Challenges & Achievements',
      desc: 'Earn milestone badges and track progress on simulated leaderboards.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#020609] text-gray-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[250px] bg-cyan-500/10 blur-[110px] rounded-full pointer-events-none" />

      <div className="max-w-3xl mx-auto w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Virtual Simulation Tier</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Virtual Trading Access
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-400 max-w-xl mx-auto">
            Unlock complete simulated crypto trading, behavioral feedback, and educational intelligence.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-[#0b131e]/90 border border-slate-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl">
          {/* Features Grid */}
          <div className="mb-8">
            <h2 className="text-xs font-mono uppercase tracking-wider text-gray-400 mb-4">
              Everything Included in Your Virtual Access
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feat, idx) => {
                const IconComponent = feat.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#070e17]/80 border border-slate-800/60"
                  >
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-200">{feat.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-px bg-slate-800/80 my-6" />

          {/* Pricing & Coupon Section */}
          <div className="space-y-6">
            <div className="bg-[#070e17] border border-slate-800 rounded-xl p-5">
              <div className="space-y-2.5 text-sm">
                <div className="flex justify-between items-center text-gray-300">
                  <span>Access Price</span>
                  <span className="font-mono font-medium">₹999</span>
                </div>
                <div className="flex justify-between items-center text-emerald-400">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    Promotional Discount (100% OFF)
                  </span>
                  <span className="font-mono font-medium">-₹999</span>
                </div>
                <div className="h-px bg-slate-800/80 pt-1" />
                <div className="flex justify-between items-center text-base sm:text-lg font-bold text-white pt-1">
                  <span>Access Cost Today</span>
                  <span className="font-mono text-emerald-400">₹0</span>
                </div>
              </div>
            </div>

            {/* Error / Success Messages */}
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 text-xs sm:text-sm text-red-400 bg-red-950/30 border border-red-800/50 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="flex items-center gap-2 p-3 text-xs sm:text-sm text-emerald-400 bg-emerald-950/30 border border-emerald-800/50 rounded-lg">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Coupon Redeem Form */}
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                  Have a promotional code?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Tag className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. CRYPTO100"
                      disabled={submitting}
                      className="block w-full pl-9 pr-3 py-2.5 bg-[#040911] border border-slate-700 rounded-lg text-sm text-white font-mono placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors uppercase"
                    />
                  </div>
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  Use promotional code <span className="font-mono text-emerald-400 font-semibold">CRYPTO100</span> to claim 100% free virtual access.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {submitting ? (
                  <>
                    <Spinner size="sm" color="#020609" />
                    <span>Unlocking Access...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Claim Virtual Access (₹0)</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </button>
            </form>

            {/* Honest non-deceptive disclaimer */}
            <div className="text-center pt-2">
              <p className="text-xs text-gray-500 flex items-center justify-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-gray-400" />
                <span>No real payment is processed. This is an educational virtual trading simulator.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
