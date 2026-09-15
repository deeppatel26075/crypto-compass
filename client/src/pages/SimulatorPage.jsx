import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Clock,
  Sparkles,
  Info,
  Layers,
  RefreshCw,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { getSimulatorPortfolio, calculateSimulatorOutcome } from '../services/simulatorService';
import Skeleton from '../components/ui/Skeleton';

const PRESET_PERCENTAGES = [-50, -25, -10, 0, 10, 25, 50, 100];

const SimulatorPage = () => {
  const [holdings, setHoldings] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [percentageInput, setPercentageInput] = useState('10');
  const [loadingHoldings, setLoadingHoldings] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState(null);
  const [inputError, setInputError] = useState('');
  const [result, setResult] = useState(null);

  // Fetch holdings
  const fetchHoldings = useCallback(async () => {
    try {
      setLoadingHoldings(true);
      setError(null);
      const res = await getSimulatorPortfolio();
      if (res && res.data) {
        const list = res.data.holdings || [];
        setHoldings(list);
        if (list.length > 0 && !selectedSymbol) {
          // Select first holding by default if price available
          const firstWithPrice = list.find((h) => h.priceAvailable) || list[0];
          setSelectedSymbol(firstWithPrice.symbol);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Unable to load simulator portfolio.');
    } finally {
      setLoadingHoldings(false);
    }
  }, [selectedSymbol]);

  useEffect(() => {
    fetchHoldings();
  }, [fetchHoldings]);

  // Validate percentage input strictly
  const validateInput = (val) => {
    if (val === '' || val === undefined) {
      setInputError('Percentage change is required.');
      return false;
    }
    const num = Number(val);
    if (!Number.isFinite(num)) {
      setInputError('Percentage change must be a valid numeric value.');
      return false;
    }
    if (num < -90 || num > 500) {
      setInputError('Percentage change must be between -90% and +500%.');
      return false;
    }
    const parts = val.toString().split('.');
    if (parts[1] && parts[1].length > 2) {
      setInputError('Percentage change cannot have more than 2 decimal places.');
      return false;
    }
    setInputError('');
    return true;
  };

  const handlePercentageChange = (e) => {
    const val = e.target.value;
    setPercentageInput(val);
    validateInput(val);
  };

  const handleApplyPreset = (presetVal) => {
    const strVal = presetVal.toString();
    setPercentageInput(strVal);
    validateInput(strVal);
  };

  const handleCalculate = async (e) => {
    e?.preventDefault();
    if (!selectedSymbol) {
      setError('Please select an asset to simulate.');
      return;
    }
    if (!validateInput(percentageInput)) {
      return;
    }

    try {
      setCalculating(true);
      setError(null);
      const numVal = Number(percentageInput);
      const res = await calculateSimulatorOutcome(selectedSymbol, numVal);
      if (res && res.data) {
        setResult(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Calculation failed.');
      setResult(null);
    } finally {
      setCalculating(false);
    }
  };

  // Currently selected holding object
  const selectedHolding = holdings.find((h) => h.symbol === selectedSymbol);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16" data-testid="simulator-page">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[#0c131a] via-[#050a0f] to-[#020609] border border-white/[0.08] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F59B]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#00D4FF]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00F59B]/10 border border-[#00F59B]/20 text-[#00F59B] text-xs font-semibold tracking-wide">
            <Calculator className="w-3.5 h-3.5" />
            <span>EXPLORATION LAYER · WHAT-IF SIMULATOR</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">
            What-If Simulator
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl leading-relaxed">
            Explore hypothetical outcomes without changing your portfolio. Analyze how user-defined
            percentage price fluctuations mathematically impact your existing simulated positions.
          </p>

          {/* Prominent Educational Disclaimer */}
          <div
            className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center gap-3 text-xs text-gray-300 font-mono"
            data-testid="simulator-disclaimer"
          >
            <Info className="w-4 h-4 text-[#00D4FF] shrink-0" />
            <span>
              Educational simulation only. Hypothetical outcomes are mathematical illustrations and not predictions or financial advice.
            </span>
          </div>
        </div>
      </div>

      {/* Global API Error */}
      {error && (
        <div
          className="p-5 rounded-2xl bg-red-950/30 border border-red-500/30 flex items-center justify-between gap-4 text-xs sm:text-sm text-red-200"
          data-testid="simulator-error"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={() => setError(null)}
            className="px-3 py-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. SECTION 1 — Select Asset */}
      <div className="space-y-4" data-testid="select-asset-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <Layers className="w-4 h-4 text-[#00F59B]" />
            <span>Section 1 — Select Your Holding</span>
          </div>
          <span className="text-xs text-gray-500 font-mono">
            {holdings.length} active holding{holdings.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Loading State */}
        {loadingHoldings && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="holdings-loading">
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <Skeleton className="h-5 w-24 rounded-md" />
                <Skeleton className="h-4 w-32 rounded-md" />
                <Skeleton className="h-6 w-full rounded-md" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State: User has no holdings */}
        {!loadingHoldings && holdings.length === 0 && (
          <div
            className="p-10 text-center rounded-3xl bg-[#050a0f] border border-white/[0.08] space-y-4 shadow-xl"
            data-testid="no-holdings-state"
          >
            <div className="w-12 h-12 rounded-2xl bg-white/[0.04] text-gray-400 flex items-center justify-center mx-auto">
              <Layers className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No Simulated Holdings Available</h3>
              <p className="text-xs sm:text-sm text-gray-400 max-w-md mx-auto">
                You don't currently hold any simulated assets to explore. Practice buying an asset in simulated markets to test scenarios.
              </p>
            </div>
            <Link
              to="/markets"
              data-testid="explore-markets-link"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00F59B] text-black font-semibold text-xs transition-colors hover:bg-[#00F59B]/90 shadow-[0_0_15px_rgba(0,245,155,0.2)]"
            >
              <span>Explore Simulated Markets</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Holdings Cards Grid */}
        {!loadingHoldings && holdings.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="holdings-grid">
            {holdings.map((h) => {
              const isSelected = selectedSymbol === h.symbol;
              return (
                <button
                  type="button"
                  key={h.symbol}
                  onClick={() => {
                    setSelectedSymbol(h.symbol);
                    setResult(null); // Clear previous calculation on switch
                  }}
                  data-testid={`holding-card-${h.symbol}`}
                  className={`text-left p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[#00F59B]/10 border-[#00F59B] shadow-[0_0_20px_rgba(0,245,155,0.12)]'
                      : 'bg-[#050a0f] border-white/[0.07] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white text-base font-display">
                        {h.symbol}
                      </span>
                      {isSelected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#00F59B] px-2 py-0.5 rounded-full bg-[#00F59B]/15 border border-[#00F59B]/30">
                          <CheckCircle2 className="w-3 h-3" />
                          Selected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400 truncate">{h.name}</p>
                  </div>

                  <div className="pt-3 border-t border-white/[0.06] space-y-1 text-xs">
                    <div className="flex justify-between text-gray-400">
                      <span>Holding:</span>
                      <span className="font-mono text-gray-200">{h.quantity} {h.symbol}</span>
                    </div>

                    <div className="flex justify-between text-gray-400">
                      <span>Current Price:</span>
                      <span className="font-mono text-gray-200">
                        {h.priceAvailable ? h.currentPrice : (
                          <span className="text-amber-400 text-[11px]">Price unavailable</span>
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between text-gray-400">
                      <span>Current Value:</span>
                      <span className="font-mono font-semibold text-white">
                        {h.priceAvailable ? h.currentValue : (
                          <span className="text-gray-500 font-sans text-[11px]">Value unavailable</span>
                        )}
                      </span>
                    </div>

                    {h.isMarketDataStale && (
                      <div className="pt-1 text-[10px] text-amber-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        <span>Using cached market data</span>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. SECTION 2 — Create a Hypothetical Scenario */}
      {holdings.length > 0 && (
        <div
          className="p-6 sm:p-8 rounded-3xl bg-[#050a0f] border border-white/[0.08] shadow-2xl space-y-6"
          data-testid="scenario-input-section"
        >
          <div className="flex items-center gap-2 text-xs font-semibold text-[#00D4FF] uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Section 2 — Create a Hypothetical Scenario</span>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="percentage-input"
              className="text-sm font-bold text-white block"
            >
              What if the price of {selectedSymbol || 'the selected asset'} changed by:
            </label>
            <p className="text-xs text-gray-400">
              Enter a hypothetical percentage change from -90% to +500% (at most 2 decimal places).
            </p>
          </div>

          {/* Percentage Input and Preset Buttons */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="relative w-full sm:w-64">
                <input
                  id="percentage-input"
                  type="number"
                  step="0.01"
                  min="-90"
                  max="500"
                  value={percentageInput}
                  onChange={handlePercentageChange}
                  data-testid="percentage-input"
                  placeholder="e.g. 10 or -20"
                  className={`w-full px-4 py-3 rounded-2xl bg-white/[0.03] border text-base font-mono text-white focus:outline-none transition-colors ${
                    inputError
                      ? 'border-rose-500 focus:border-rose-500'
                      : 'border-white/[0.1] focus:border-[#00F59B]'
                  }`}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-mono pointer-events-none">
                  %
                </span>
              </div>

              {/* Submit Calculate Button */}
              <button
                type="button"
                onClick={handleCalculate}
                disabled={calculating || Boolean(inputError) || !selectedHolding?.priceAvailable}
                data-testid="calculate-btn"
                className={`w-full sm:w-auto px-6 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                  calculating || Boolean(inputError) || !selectedHolding?.priceAvailable
                    ? 'bg-white/[0.05] text-gray-500 cursor-not-allowed border border-white/5'
                    : 'bg-[#00F59B] text-black hover:bg-[#00F59B]/90 shadow-[0_0_20px_rgba(0,245,155,0.3)] active:scale-98'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>{calculating ? 'Calculating...' : 'Calculate Hypothetical Value'}</span>
              </button>
            </div>

            {/* Input Validation Error */}
            {inputError && (
              <p className="text-xs text-rose-400 font-medium" data-testid="input-error-msg">
                {inputError}
              </p>
            )}

            {/* Price unavailable warning for selected holding */}
            {selectedHolding && !selectedHolding.priceAvailable && (
              <div
                className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2 font-mono"
                data-testid="price-unavailable-notice"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Market price unavailable for {selectedSymbol}. Simulation cannot be calculated right now.</span>
              </div>
            )}

            {/* Presets Row */}
            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
                Quick Presets (Examples Only):
              </span>
              <div className="flex flex-wrap items-center gap-2" data-testid="presets-group">
                {PRESET_PERCENTAGES.map((preset) => (
                  <button
                    type="button"
                    key={preset}
                    onClick={() => handleApplyPreset(preset)}
                    data-testid={`preset-btn-${preset}`}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] text-xs text-gray-300 border border-white/[0.08] font-mono transition-colors"
                  >
                    {preset > 0 ? `+${preset}%` : `${preset}%`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. SECTION 3 — Results & Educational Visualization */}
      {result && (
        <div className="space-y-6" data-testid="simulator-results-section">
          {/* Stale data alert if applicable */}
          {result.isMarketDataStale && (
            <div
              className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-xs text-amber-300 font-mono"
              data-testid="stale-market-notice"
            >
              <Clock className="w-4 h-4 shrink-0" />
              <span>Using cached market data. This simulation is based on the latest available cached price.</span>
            </div>
          )}

          {/* Results Comparison Grid */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#050a0f] border border-white/[0.08] shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-bold text-[#00F59B] uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Hypothetical Calculation Results</span>
              </div>
              <span className="text-xs text-gray-400 font-mono" data-testid="result-symbol-pct">
                {result.symbol} at {result.percentageChange > 0 ? `+${result.percentageChange}%` : `${result.percentageChange}%`}
              </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Asset Price Comparison */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <span className="text-xs text-gray-400 uppercase tracking-wider block">
                  Asset Unit Price
                </span>
                <div className="space-y-1">
                  <div className="text-xs text-gray-400 flex justify-between font-mono">
                    <span>Current:</span>
                    <span className="text-gray-300" data-testid="current-price-display">
                      {result.currentPrice}
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-white flex justify-between font-mono">
                    <span className="text-xs font-sans text-gray-400 pt-1">Hypothetical:</span>
                    <span className="text-[#00D4FF]" data-testid="hypothetical-price-display">
                      {result.hypotheticalPrice}
                    </span>
                  </div>
                </div>
              </div>

              {/* Holding Value Comparison */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <span className="text-xs text-gray-400 uppercase tracking-wider block">
                  Holding Value ({result.quantity} {result.symbol})
                </span>
                <div className="space-y-1">
                  <div className="text-xs text-gray-400 flex justify-between font-mono">
                    <span>Current:</span>
                    <span className="text-gray-300" data-testid="current-value-display">
                      {result.currentValue}
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-white flex justify-between font-mono">
                    <span className="text-xs font-sans text-gray-400 pt-1">Hypothetical:</span>
                    <span className="text-white" data-testid="hypothetical-value-display">
                      {result.hypotheticalValue}
                    </span>
                  </div>
                </div>
              </div>

              {/* Net Hypothetical Change */}
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
                <span className="text-xs text-gray-400 uppercase tracking-wider block">
                  Hypothetical Value Change
                </span>
                <div className="space-y-1">
                  <div className="text-xs text-gray-400 flex justify-between font-mono">
                    <span>Percentage:</span>
                    <span className="text-gray-300">
                      {result.percentageChange > 0 ? `+${result.percentageChange}%` : `${result.percentageChange}%`}
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-white flex justify-between font-mono">
                    <span className="text-xs font-sans text-gray-400 pt-1">Net Change:</span>
                    <span
                      className={result.hypotheticalChangeCents >= 0 ? 'text-[#00F59B]' : 'text-rose-400'}
                      data-testid="hypothetical-change-display"
                    >
                      {result.hypotheticalChange}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Simple Educational Value Comparison Visualization */}
            <div className="p-5 rounded-2xl bg-slate-900/40 border border-white/[0.06] space-y-4" data-testid="comparison-visualization">
              <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider block">
                Visual Comparison: Current vs. Hypothetical
              </span>

              {/* Visual Bars */}
              <div className="space-y-3 font-mono text-xs">
                <div className="space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Current Holding Value</span>
                    <span>{result.currentValue}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full bg-gray-400 rounded-full transition-all"
                      style={{
                        width: `${
                          result.currentValueCents === 0
                            ? 0
                            : Math.min(
                                100,
                                Math.max(
                                  10,
                                  Math.round(
                                    (result.currentValueCents /
                                      Math.max(result.currentValueCents, result.hypotheticalValueCents)) *
                                      100
                                  )
                                )
                              )
                        }%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-gray-400">
                    <span>Hypothetical Holding Value</span>
                    <span className="text-white font-bold">{result.hypotheticalValue}</span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        result.hypotheticalChangeCents >= 0
                          ? 'bg-[#00F59B]'
                          : 'bg-rose-400'
                      }`}
                      style={{
                        width: `${
                          result.hypotheticalValueCents === 0
                            ? 0
                            : Math.min(
                                100,
                                Math.max(
                                  10,
                                  Math.round(
                                    (result.hypotheticalValueCents /
                                      Math.max(result.currentValueCents, result.hypotheticalValueCents)) *
                                      100
                                  )
                                )
                              )
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 leading-relaxed pt-2 border-t border-white/[0.06]">
                These figures illustrate the mathematical effect of the selected hypothetical price change on your current holding.
              </p>
            </div>

            {/* Explanation Panel: "How the calculation works" */}
            <div
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3"
              data-testid="math-explanation"
            >
              <div className="flex items-center gap-2 text-xs font-semibold text-[#00D4FF] uppercase tracking-wider">
                <Info className="w-4 h-4" />
                <span>Mathematical Breakdown — How the Calculation Works</span>
              </div>
              <div className="space-y-2 text-xs text-gray-300 font-mono leading-relaxed">
                <div>1. Current Holding Value = Quantity ({result.quantity}) × Current Unit Price ({result.currentPrice}) = {result.currentValue}</div>
                <div>2. Hypothetical Price = Current Price ({result.currentPrice}) × (1 + {result.percentageChange}%) = {result.hypotheticalPrice}</div>
                <div>3. Hypothetical Holding Value = Quantity ({result.quantity}) × Hypothetical Price ({result.hypotheticalPrice}) = {result.hypotheticalValue}</div>
                <div>4. Net Hypothetical Change = Hypothetical Value ({result.hypotheticalValue}) - Current Value ({result.currentValue}) = {result.hypotheticalChange}</div>
              </div>
            </div>

            {/* Educational Disclaimer within Results */}
            <div
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-gray-400 font-mono flex items-center gap-2"
              data-testid="results-disclaimer"
            >
              <Info className="w-4 h-4 text-[#00D4FF] shrink-0" />
              <span>Educational simulation only. Hypothetical figures are purely mathematical illustrations and not trading predictions.</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Educational Sandbox Footer Disclaimer */}
      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-center text-[11px] text-gray-500 font-mono">
        <div>EDUCATIONAL WHAT-IF SIMULATOR · Read-only mathematical calculations. No trades executed, no wallet balances modified.</div>
      </div>
    </div>
  );
};

export default SimulatorPage;
