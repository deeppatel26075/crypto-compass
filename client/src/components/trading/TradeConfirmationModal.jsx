import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { formatPrice } from '../../utils/marketFormatters';

/**
 * TradeConfirmationModal
 * Handles the order review, execution in-flight, success confirmation, and friendly failure states.
 */
const TradeConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
  orderData,
  executionResult,
  executionError,
  onContinue,
}) => {
  if (!isOpen) return null;

  const isBuy = orderData?.side === 'BUY';
  const isSuccess = Boolean(executionResult?.trade);
  const isError = Boolean(executionError);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020609]/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-[#0a1420] border border-white/[0.12] shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Header Strip */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-2">
            <span
              className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase tracking-wider ${
                isBuy
                  ? 'bg-[#00F59B]/10 text-[#00F59B] border border-[#00F59B]/30'
                  : 'bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/30'
              }`}
            >
              {orderData?.side} ORDER
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

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* STATE 1: SUCCESS */}
          {isSuccess && (
            <div className="text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B] mx-auto shadow-[0_0_20px_rgba(0,245,155,0.2)]">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-white font-sans">
                  Paper Trade Executed
                </h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  {executionResult.trade.side} {executionResult.trade.quantity} {executionResult.trade.symbol}
                </p>
              </div>

              {/* Execution Receipt Box */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5 text-left font-mono text-xs">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Execution Price:</span>
                  <strong className="text-white">
                    {formatPrice(executionResult.trade.executionPrice)}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Trade Value:</span>
                  <strong className="text-white">
                    {formatPrice(executionResult.trade.grossValue)}
                  </strong>
                </div>
                <div className="flex justify-between items-center text-gray-400">
                  <span>Trading Fee:</span>
                  <strong className="text-[#00F59B]">$0.00 (Free Simulator)</strong>
                </div>
                <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">Remaining Virtual Cash:</span>
                  <span className="text-base font-bold text-[#00F59B]">
                    {formatPrice(executionResult.wallet.cashBalance)}
                  </span>
                </div>
              </div>

              <button
                onClick={onContinue}
                className="w-full py-3 rounded-xl bg-[#00F59B] hover:bg-[#00F59B]/90 text-[#020609] text-sm font-bold font-sans transition-all shadow-[0_0_20px_rgba(0,245,155,0.3)] flex items-center justify-center gap-2"
              >
                <span>Continue Practicing</span>
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
                  Order Not Executed
                </h3>
                <p className="text-xs text-gray-300 mt-1 max-w-xs mx-auto">
                  {executionError}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center gap-2 text-xs font-mono text-[#00D4FF]">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Your simulated wallet has not been changed.</span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold font-mono transition-colors"
              >
                Dismiss & Adjust Order
              </button>
            </div>
          )}

          {/* STATE 3: ORDER REVIEW (BEFORE SUBMIT) */}
          {!isSuccess && !isError && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-extrabold text-white font-sans">
                  Review Paper Trade
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Verify your simulated order details before executing.
                </p>
              </div>

              {/* Order breakdown */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center text-gray-400">
                  <span>Action:</span>
                  <span
                    className={`font-bold flex items-center gap-1 ${
                      isBuy ? 'text-[#00F59B]' : 'text-[#EF4444]'
                    }`}
                  >
                    {isBuy ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{orderData?.side} {orderData?.name} ({orderData?.symbol})</span>
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-400">
                  <span>Order Type:</span>
                  <span className="text-white font-semibold">MARKET ORDER</span>
                </div>

                <div className="flex justify-between items-center text-gray-400">
                  <span>Quantity:</span>
                  <span className="text-white font-bold text-sm">
                    {orderData?.quantity} {orderData?.symbol}
                  </span>
                </div>

                <div className="flex justify-between items-center text-gray-400">
                  <span>Estimated Price:</span>
                  <span className="text-white">
                    {formatPrice(orderData?.currentPrice || 0)}
                  </span>
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">Estimated Total:</span>
                  <span
                    className={`text-base font-extrabold ${
                      isBuy ? 'text-white' : 'text-[#00F59B]'
                    }`}
                  >
                    {formatPrice(orderData?.estimatedTotal || 0)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] font-mono text-gray-400 text-center leading-relaxed">
                Execution price will be determined by the server market-data service when confirmed.
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
                  onClick={onConfirm}
                  disabled={isSubmitting}
                  className={`py-2.5 rounded-xl text-[#020609] text-xs font-bold font-sans transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(0,245,155,0.3)] disabled:opacity-50 ${
                    isBuy ? 'bg-[#00F59B] hover:bg-[#00F59B]/90' : 'bg-white hover:bg-gray-100'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing...</span>
                    </>
                  ) : (
                    <span>Confirm Paper Trade</span>
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

export default TradeConfirmationModal;
