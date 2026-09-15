import React from 'react';
import {
  AlertTriangle,
  RefreshCw,
  X,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
} from 'lucide-react';

/**
 * Format standard price in USD (e.g. 50000 -> "$50,000.00")
 */
function formatUSD(val) {
  if (val === null || val === undefined || isNaN(val)) return '—';
  const num = typeof val === 'number' ? val : Number(val);
  return `$${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * ExitTradeModal
 * Allows a user to exit 100% of a holding via the standard Phase 9 SELL order pipeline.
 */
const ExitTradeModal = ({
  isOpen,
  onClose,
  holding,
  onConfirmExit,
  isSubmitting,
  executionResult,
  executionError,
  onContinue,
}) => {
  if (!isOpen || !holding) return null;

  const isSuccess = Boolean(executionResult?.trade);
  const isError = Boolean(executionError);

  const isProfit = (holding.profitLossCents ?? 0) >= 0;
  const pnlPercentStr =
    holding.profitLossPercentage !== null && holding.profitLossPercentage !== undefined
      ? `${holding.profitLossPercentage >= 0 ? '+' : ''}${holding.profitLossPercentage.toFixed(2)}%`
      : '—';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020609]/80 backdrop-blur-md animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-trade-title"
    >
      <div className="relative w-full max-w-md rounded-2xl bg-[#0a1420] border border-white/[0.12] shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30">
              EXIT POSITION
            </span>
            <span className="text-xs font-mono text-gray-400">Simulation</span>
          </div>

          {!isSubmitting && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          {/* STATE 1: SUCCESS */}
          {isSuccess && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B] mx-auto shadow-[0_0_20px_rgba(0,245,155,0.2)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white font-sans">
                  Position Exited Successfully
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  Sold 100% of {holding.name} ({holding.symbol})
                </p>
              </div>

              {/* Receipt Details */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5 text-left font-mono text-xs">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Sold Quantity:</span>
                  <strong className="text-white">
                    {executionResult.trade.quantity} {holding.symbol}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Fill Price:</span>
                  <strong className="text-white">
                    {formatUSD(executionResult.trade.executionPrice)}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Gross Proceeds:</span>
                  <strong className="text-[#00F59B]">
                    {formatUSD(executionResult.trade.grossValue)}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Realized P&L:</span>
                  <strong
                    className={
                      (executionResult.trade.realizedProfitLossCents ?? 0) >= 0
                        ? 'text-[#00F59B]'
                        : 'text-[#EF4444]'
                    }
                  >
                    {executionResult.trade.realizedProfitLoss !== null
                      ? `${(executionResult.trade.realizedProfitLossCents ?? 0) >= 0 ? '+' : ''}${formatUSD(executionResult.trade.realizedProfitLoss)} (${(executionResult.trade.realizedProfitLossPercentage ?? 0) >= 0 ? '+' : ''}${(executionResult.trade.realizedProfitLossPercentage ?? 0).toFixed(2)}%)`
                      : '—'}
                  </strong>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">New Cash Balance:</span>
                  <span className="text-base font-bold text-[#00F59B]">
                    {formatUSD(executionResult.wallet.cashBalance)}
                  </span>
                </div>
              </div>

              <button
                onClick={onContinue}
                className="w-full py-3 rounded-xl bg-[#00F59B] hover:bg-[#00F59B]/90 text-[#020609] text-sm font-bold font-sans transition-all shadow-[0_0_20px_rgba(0,245,155,0.3)] flex items-center justify-center gap-2"
              >
                <span>Back to Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STATE 2: ERROR */}
          {isError && !isSuccess && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] mx-auto">
                <AlertTriangle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white font-sans">
                  Exit Could Not Be Completed
                </h3>
                <p className="text-xs text-gray-300 mt-1 max-w-xs mx-auto">
                  {executionError}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center gap-2 text-xs font-mono text-[#00D4FF]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Your simulated holding and wallet have not been changed.</span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold font-mono transition-colors"
              >
                Dismiss & Refresh
              </button>
            </div>
          )}

          {/* STATE 3: CONFIRMATION REVIEW */}
          {!isSuccess && !isError && (
            <div className="space-y-4">
              <div>
                <h3 id="exit-trade-title" className="text-lg font-extrabold text-white font-sans">
                  Confirm Position Exit
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Sell 100% of your simulated {holding.name} position at market price.
                </p>
              </div>

              {/* Order breakdown */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Action:</span>
                  <span className="font-bold flex items-center gap-1 text-[#EF4444]">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>SELL 100% ({holding.symbol})</span>
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-400">
                  <span>Quantity to Sell:</span>
                  <span className="text-white font-bold text-sm">
                    {holding.quantity} {holding.symbol}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-400">
                  <span>Current Market Price:</span>
                  <span className="text-white">
                    {holding.priceAvailable ? holding.currentPrice : 'Unavailable'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-400">
                  <span>Estimated Proceeds:</span>
                  <span className="text-[#00F59B] font-bold">
                    {holding.priceAvailable ? holding.currentMarketValue : 'Unavailable'}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-400">
                  <span>Cost Basis:</span>
                  <span className="text-white">
                    {holding.costBasis || '—'}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">Unrealized P&L:</span>
                  <span
                    className={`font-extrabold flex items-center gap-1 ${
                      isProfit ? 'text-[#00F59B]' : 'text-[#EF4444]'
                    }`}
                  >
                    {isProfit ? (
                      <TrendingUp className="w-3.5 h-3.5" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {holding.profitLoss !== null
                        ? `${isProfit ? '+' : ''}${holding.profitLoss} (${pnlPercentStr})`
                        : '—'}
                    </span>
                  </span>
                </div>
              </div>

              <p className="text-[11px] font-mono text-gray-400 text-center leading-relaxed">
                Proceeds are estimated based on current server market price and will execute as a market order.
              </p>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-gray-300 text-xs font-bold font-mono transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => onConfirmExit(holding)}
                  disabled={isSubmitting || !holding.priceAvailable}
                  className="py-2.5 rounded-xl bg-[#EF4444] hover:bg-[#EF4444]/90 text-white text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(239,68,68,0.3)] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Exiting...</span>
                    </>
                  ) : (
                    <span>Confirm Exit</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExitTradeModal;
