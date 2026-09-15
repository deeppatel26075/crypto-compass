import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Layers,
  Sparkles,
  Calculator,
} from 'lucide-react';
import { getScenarioCatalog, getScenarioProgress } from '../services/scenarioService';
import Skeleton from '../components/ui/Skeleton';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Scenarios' },
  { id: 'crypto_fundamentals', label: 'Crypto Fundamentals' },
  { id: 'market_basics', label: 'Market Basics' },
  { id: 'trading_fundamentals', label: 'Trading Fundamentals' },
  { id: 'risk_management', label: 'Risk Management' },
  { id: 'trading_discipline', label: 'Trading Discipline' },
];

const CATEGORY_COLORS = {
  crypto_fundamentals: '#00D4FF', // Cyan
  market_basics: '#F59E0B', // Amber
  trading_fundamentals: '#00F59B', // Emerald / Neon Green
  risk_management: '#EF4444', // Red / Rose
  trading_discipline: '#A855F7', // Purple
};

const ScenariosPage = () => {
  const [scenarios, setScenarios] = useState([]);
  const [completedScenarios, setCompletedScenarios] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [catalogRes, progressRes] = await Promise.all([
        getScenarioCatalog(),
        getScenarioProgress().catch(() => ({ data: { completedScenarios: [] } })),
      ]);

      if (catalogRes && catalogRes.data) {
        setScenarios(catalogRes.data.scenarios || []);
        setError(null);
      } else {
        throw new Error('No scenario data returned from server.');
      }

      if (progressRes && progressRes.data) {
        setCompletedScenarios(progressRes.data.completedScenarios || []);
      }
    } catch (err) {
      setError(err.message || 'Unable to load educational scenarios.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Client-side filtering by category and search term
  const filteredScenarios = useMemo(() => {
    return scenarios.filter((scenario) => {
      const matchesCategory =
        selectedCategory === 'all' || scenario.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        scenario.title.toLowerCase().includes(q) ||
        scenario.description.toLowerCase().includes(q) ||
        (scenario.categoryLabel && scenario.categoryLabel.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [scenarios, selectedCategory, searchQuery]);

  const totalScenarios = scenarios.length || 10;
  const completedCount = completedScenarios.length;
  const progressPercent = Math.round((completedCount / totalScenarios) * 100);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16" data-testid="scenarios-page">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c131a] via-[#050a0f] to-[#020609] border border-white/[0.08] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F59B]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#00D4FF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/20 text-[#00F59B] text-xs font-semibold tracking-wide">
              <Compass className="w-3.5 h-3.5" />
              <span>PRACTICE LAYER · SCENARIO MODE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
              Scenario Mode
            </h1>
            <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              Practice applying what you've learned in realistic educational situations.
              Evaluate simulated market challenges, analyze decision options, and understand the pedagogical reasoning behind each choice.
            </p>
          </div>

          {/* Progress Card */}
          <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md min-w-[240px] space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-400 font-mono">
              <span className="flex items-center gap-1.5 text-gray-300 font-medium">
                <Layers className="w-3.5 h-3.5 text-[#00F59B]" />
                Scenario Progress
              </span>
              <span className="font-bold text-white" data-testid="scenario-progress-count">
                Completed {completedCount} / {totalScenarios}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00F59B] to-[#00D4FF] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, progressPercent)}%` }}
                data-testid="scenario-progress-bar"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-gray-400 font-mono">
              <span>{progressPercent}% Completed</span>
              <span className="text-gray-400 font-sans">Zero Capital Risk</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Controls: Category Filter Tabs & Search Bar */}
      <div className="space-y-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/[0.06]">
          {CATEGORY_TABS.map((tab) => {
            const isActive = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                data-testid={`category-tab-${tab.id}`}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#00F59B] text-black shadow-[0_0_15px_rgba(0,245,155,0.25)] font-bold'
                    : 'bg-white/[0.03] text-gray-400 hover:text-gray-200 hover:bg-white/[0.06] border border-white/[0.06]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search educational scenarios by title, description, or topic..."
            data-testid="scenario-search-input"
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#050a0f] border border-white/[0.08] text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-[#00F59B]/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-200 px-2 py-1 rounded bg-white/[0.05]"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* 3. Error State */}
      {error && (
        <div
          className="p-6 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center justify-between gap-4"
          data-testid="scenarios-error"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
          <button
            onClick={fetchData}
            className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* 4. Loading Skeleton Grid */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="scenarios-loading">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-28 rounded-md" />
                <Skeleton className="h-4 w-16 rounded-md" />
              </div>
              <Skeleton className="h-6 w-3/4 rounded-md" />
              <Skeleton className="h-12 w-full rounded-md" />
              <div className="pt-4 border-t border-white/[0.06] flex justify-between items-center">
                <Skeleton className="h-4 w-20 rounded-md" />
                <Skeleton className="h-8 w-28 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. Empty State */}
      {!loading && !error && filteredScenarios.length === 0 && (
        <div
          className="p-12 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3"
          data-testid="scenarios-empty"
        >
          <Compass className="w-10 h-10 text-gray-500 mx-auto" />
          <h3 className="text-lg font-bold text-white">No scenarios found</h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            No scenarios match your search query or selected category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* 6. Scenario Cards Grid */}
      {!loading && !error && filteredScenarios.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5" data-testid="scenario-catalog-grid">
          {filteredScenarios.map((scenario) => {
            const isCompleted = completedScenarios.includes(scenario.id);
            const catColor = CATEGORY_COLORS[scenario.category] || '#00F59B';

            return (
              <div
                key={scenario.id}
                data-testid={`scenario-card-${scenario.id}`}
                className="group relative p-6 rounded-2xl bg-[#050a0f] border border-white/[0.07] hover:border-white/[0.15] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  {/* Category Badge & Meta */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                      style={{
                        backgroundColor: `${catColor}15`,
                        color: catColor,
                        border: `1px solid ${catColor}30`,
                      }}
                    >
                      {scenario.categoryLabel || scenario.category}
                    </span>

                    <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                      <span>{scenario.difficulty}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {scenario.estimatedMinutes} min
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white group-hover:text-[#00F59B] transition-colors mb-2">
                    {scenario.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-gray-400 leading-relaxed line-clamp-3 mb-4">
                    {scenario.description}
                  </p>
                </div>

                {/* Footer: Completion status and CTA */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <span
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#00F59B]"
                        data-testid={`scenario-completed-badge-${scenario.id}`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-gray-500 font-medium">
                        Not Started
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/scenarios/${scenario.id}`}
                    data-testid={`start-scenario-link-${scenario.id}`}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      isCompleted
                        ? 'bg-white/[0.05] hover:bg-white/10 text-gray-200 border border-white/10'
                        : 'bg-[#00F59B] text-black hover:bg-[#00F59B]/90 shadow-[0_0_15px_rgba(0,245,155,0.2)]'
                    }`}
                  >
                    <span>{isCompleted ? 'Review Scenario' : 'Start Scenario'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6.5 Educational Bridge to What-If Simulator */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#00F59B]/10 via-[#8B5CF6]/10 to-transparent border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#00F59B]/10 border border-[#00F59B]/20 flex items-center justify-center text-[#00F59B] shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">Next Step: What-If Portfolio Simulator</div>
            <div className="text-xs text-gray-400">Model hypothetical price fluctuations on your holdings with zero financial risk.</div>
          </div>
        </div>
        <Link
          to="/simulator"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold border border-white/15 transition-all shrink-0"
        >
          <span>Launch Simulator</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 7. Educational Sandbox Disclaimer */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-[11px] text-gray-500 font-mono">
        <div>EDUCATIONAL SIMULATION · Conceptual decision practice in realistic educational situations. No real funds, no financial advice, no price predictions.</div>
      </div>
    </div>
  );
};

export default ScenariosPage;
