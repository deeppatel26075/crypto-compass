import React, { useState, useMemo, useEffect } from 'react';
import {
  Wallet,
  Coins,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react';
import { formatPrice } from '../../utils/marketFormatters';
import { executeOrder } from '../../services/tradingService';
import TradeConfirmationModal from './TradeConfirmationModal';

/**
 * Generate a unique idempotency key for every distinct trade submission
 */
function generateIdempotencyKey(symbol, side) {
  return `cc_${symbol.toLowerCase()}_${side.toLowerCase()}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

const ALLOCATION_PRESETS = [0.25, 0.5, 0.75, 1.0];

const TradePanel = ({ asset, account, onTradeCompleted, onOrderChange }) => {
  const [side, setSide] = useState('BUY');
  const [quantity, setQuantity] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResult, setExecutionResult] = useState(null);
  const [executionError, setExecutionError] = useState(null);

  // Notify parent of active trade intent for Trade Coach
  useEffect(() => {
    if (typeof onOrderChange === 'function') {
      onOrderChange({ side, quantity });
    }
  }, [side, quantity, onOrderChange]);

  const isBuy = side === 'BUY';

  // Derived account balances
  const availableCash = account?.wallet?.cashBalance ?? 0;
  const currentHolding = useMemo(() => {
    if (!account?.holdings || !asset?.symbol) return null;
    return account.holdings.find(
      (h) => h.symbol.toUpperCase() === asset.symbol.toUpperCase()
    ) || null;
  }, [account?.holdings, asset?.symbol]);

  const ownedQuantity = currentHolding ? parseFloat(currentHolding.quantity) : 0;
  const currentPrice = asset?.currentPrice || 0;

  // Numeric quantity parse
  const numericQty = parseFloat(quantity) || 0;
  const estimatedTotal = numericQty * currentPrice;

  // Real-time validation checks
  const hasInsufficientCash = isBuy && numericQty > 0 && estimatedTotal > availableCash;
  const hasInsufficientHoldings = !isBuy && numericQty > 0 && numericQty > ownedQuantity;
  const isValidQuantity = numericQty > 0 && !isNaN(numericQty) && isFinite(numericQty);
  const canReview = isValidQuantity && !hasInsufficientCash && !hasInsufficientHoldings && currentPrice > 0;

  // Percentage shortcut handler
  const handlePresetClick = (pct) => {
    if (currentPrice <= 0) return;

    if (isBuy) {
      if (availableCash <= 0) {
        setQuantity('0');
        return;
      }
      const targetSpend = availableCash * pct;
      const targetQty = targetSpend / currentPrice;
      // Round down to 6 decimal places to prevent sub-cent overflow
      const factor = 1e6;
      const safeQty = (Math.floor(targetQty * factor) / factor).toFixed(6).replace(/\.?0+$/, '');
      setQuantity(safeQty);
    } else {
      if (ownedQuantity <= 0) {
        setQuantity('0');
        return;
      }
      const targetQty = ownedQuantity * pct;
      // Truncate to precision
      const factor = 1e6;
      const safeQty = (Math.floor(targetQty * factor) / factor).toFixed(6).replace(/\.?0+$/, '');
      setQuantity(safeQty);
    }
  };

  // Open confirmation modal
  const handleOpenReview = (e) => {
    e.preventDefault();
    if (!canReview) return;
    setExecutionResult(null);
    setExecutionError(null);
    setIsModalOpen(true);
  };

  // Execute order via server API
  const handleConfirmOrder = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setExecutionError(null);

    const idempotencyKey = generateIdempotencyKey(asset.symbol, side);

    try {
      const res = await executeOrder({
        symbol: asset.symbol,
        side,
        quantity: String(quantity).trim(),
        orderType: 'MARKET',
        idempotencyKey,
      });

      if (res && res.success && res.data) {
        setExecutionResult(res.data);
        if (onTradeCompleted) {
          onTradeCompleted(res.data);
        }
      } else {
        throw new Error(res?.message || 'Trade execution failed.');
      }
    } catch (err) {
      setExecutionError(err.message || 'Order could not be executed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinueAfterSuccess = () => {
    setIsModalOpen(false);
    setQuantity('');
    setExecutionResult(null);
    setExecutionError(null);
  };

  return (
    <div className="rounded-2xl bg-[#0a1420]/90 border border-white/[0.08] backdrop-blur-xl p-5 sm:p-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col justify-between space-y-5">
      {/* Top Header: Title & Side Toggle */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00F59B] animate-pulse" />
            <h2 className="text-base sm:text-lg font-extrabold text-white font-sans">
              Paper Trading Simulator
            </h2>
          </div>
          <span className="px-2 py-0.5 rounded bg-[#00D4FF]/10 border border-[#00D4FF]/20 text-[10px] font-mono text-[#00D4FF]">
            Zero Real Money
          </span>
        </div>

        {/* BUY / SELL Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06]">
          <button
            type="button"
            onClick={() => {
              setSide('BUY');
              setQuantity('');
            }}
            className={`py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
              isBuy
                ? 'bg-[#00F59B] text-[#020609] shadow-[0_0_15px_rgba(0,245,155,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>BUY</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setSide('SELL');
              setQuantity('');
            }}
            className={`py-2 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center gap-1.5 ${
              !isBuy
                ? 'bg-[#EF4444] text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
                : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>SELL</span>
          </button>
        </div>
      </div>

      {/* Balances Strip */}
      <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-1.5 text-xs font-mono">
        {isBuy ? (
          <div className="flex justify-between items-center">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-[#00F59B]" />
              <span>Available Virtual Cash:</span>
            </span>
            <span className="font-bold text-white">
              {formatPrice(availableCash)}
            </span>
          </div>
        ) : (
          <div className="flex justify-between items-center">
            <span className="text-gray-400 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-[#00D4FF]" />
              <span>Available {asset.symbol} Holding:</span>
            </span>
            <span className="font-bold text-white">
              {ownedQuantity.toFixed(4)} {asset.symbol}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-[11px] text-gray-500 pt-1 border-t border-white/[0.04]">
          <span>Current Market Reference:</span>
          <span className="text-gray-300 font-semibold">{formatPrice(currentPrice)}</span>
        </div>
      </div>

      {/* Quantity Input Form */}
      <form onSubmit={handleOpenReview} className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs font-mono">
            <label htmlFor="crypto-quantity-input" className="text-gray-300 font-semibold">
              Order Quantity ({asset.symbol})
            </label>
            <span className="text-[10px] text-gray-500">Market Order</span>
          </div>

          <div className="relative">
            <input
              id="crypto-quantity-input"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={quantity}
              onChange={(e) => {
                // Sanitize input: digits and max 1 period
                const val = e.target.value.replace(/[^0-9.]/g, '');
                const clean = val.indexOf('.') === -1 ? val : val.slice(0, val.indexOf('.') + 1) + val.slice(val.indexOf('.') + 1).replace(/\./g, '');
                setQuantity(clean);
              }}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white font-mono text-base font-bold focus:outline-none focus:border-[#00F59B] focus:ring-1 focus:ring-[#00F59B] placeholder-gray-600 transition-all pr-16"
            />
            <span className="absolute right-4 top-3.5 text-xs font-mono font-bold text-gray-400">
              {asset.symbol}
            </span>
          </div>
        </div>

        {/* Quick Allocation Percentage Chips */}
        <div className="grid grid-cols-4 gap-1.5">
          {ALLOCATION_PRESETS.map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => handlePresetClick(pct)}
              className="py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-gray-300 hover:text-white border border-white/[0.05] text-[11px] font-mono font-semibold transition-colors"
            >
              {pct === 1.0 ? 'MAX' : `${pct * 100}%`}
            </button>
          ))}
        </div>

        {/* Estimated Order Summary */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1.5 text-xs font-mono">
          <div className="flex justify-between items-center text-gray-400">
            <span>Estimated Total:</span>
            <span
              className={`text-sm font-extrabold ${
                isBuy ? 'text-white' : 'text-[#00F59B]'
              }`}
            >
              {formatPrice(estimatedTotal)}
            </span>
          </div>
          <div className="text-[10px] text-gray-500 leading-tight">
            ESTIMATED · Execution price determined server-side at confirmation.
          </div>
        </div>

        {/* Validation Warning Callouts */}
        {hasInsufficientCash && (
          <div className="p-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center gap-2 text-xs font-mono text-[#EF4444]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Insufficient virtual cash for this order.</span>
          </div>
        )}

        {hasInsufficientHoldings && (
          <div className="p-2.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center gap-2 text-xs font-mono text-[#EF4444]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>You don't own enough {asset.symbol} to sell this amount.</span>
          </div>
        )}

        {/* Main Review / Submit Button */}
        <button
          type="submit"
          disabled={!canReview}
          className={`w-full py-3.5 rounded-xl text-xs font-bold font-sans transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${
            isBuy
              ? 'bg-[#00F59B] text-[#020609] hover:bg-[#00F59B]/90 shadow-[0_0_20px_rgba(0,245,155,0.3)]'
              : 'bg-[#EF4444] text-white hover:bg-[#EF4444]/90 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
          }`}
        >
          {isBuy ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{isBuy ? 'Review Paper Buy' : 'Review Paper Sell'}</span>
        </button>
      </form>

      {/* Educational Simulation Notice */}
      <div className="pt-2 border-t border-white/[0.06] text-[10px] font-mono text-gray-500 flex items-start gap-2">
        <Shield className="w-3.5 h-3.5 text-[#00F59B] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-gray-400">PAPER TRADING SIMULATION: </strong>
          Practice with virtual funds using live market quotes. Zero real money involved. Not financial advice.
        </p>
      </div>

      {/* Review & Confirmation Modal */}
      <TradeConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmOrder}
        isSubmitting={isSubmitting}
        orderData={{
          side,
          name: asset.name,
          symbol: asset.symbol,
          quantity,
          currentPrice,
          estimatedTotal,
        }}
        executionResult={executionResult}
        executionError={executionError}
        onContinue={handleContinueAfterSuccess}
      />
    </div>
  );
};

export default TradePanel;
