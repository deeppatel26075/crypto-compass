import React from 'react';
import { History, ArrowDownLeft, ShieldAlert, RefreshCw, Sparkles } from 'lucide-react';

const formatUSD = (cents) => {
  if (typeof cents !== 'number' || isNaN(cents)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(cents / 100);
};

const formatDate = (isoString) => {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch (e) {
    return isoString;
  }
};

const RecentActivity = ({ transactions = [], loading = false, error = null, onRetry }) => {
  return (
    <div className="w-full rounded-2xl bg-[#0a1420]/80 border border-white/[0.08] p-6 sm:p-7 backdrop-blur-xl shadow-[0_4px_25px_rgba(0,0,0,0.3)] flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B]">
              <History className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-gray-400 uppercase">
                TRANSACTION LEDGER
              </span>
              <h3 className="text-base font-bold text-white font-sans">
                Recent Wallet Activity
              </h3>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[10px] font-mono text-gray-400">
            Wallet Events
          </span>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="py-8 space-y-3">
            <div className="h-12 w-full rounded-xl bg-white/[0.04] animate-pulse" />
            <div className="h-12 w-full rounded-xl bg-white/[0.04] animate-pulse" />
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className="py-6 px-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-between gap-3 text-xs text-[#FCA5A5]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#EF4444] flex-shrink-0" />
              <span>{error}</span>
            </div>
            {onRetry && (
              <button
                onClick={onRetry}
                className="inline-flex items-center gap-1 text-xs font-bold text-white underline hover:text-[#00F59B]"
              >
                <RefreshCw className="w-3 h-3" />
                Retry
              </button>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && transactions.length === 0 && (
          <div className="py-8 text-center">
            <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-2 text-gray-500">
              <History className="w-5 h-5" />
            </div>
            <p className="text-xs font-medium text-gray-300">No activity yet</p>
            <p className="text-[11px] text-gray-500 mt-0.5">
              Wallet balance and allocation adjustments will appear here.
            </p>
          </div>
        )}

        {/* Transaction entries */}
        {!loading && !error && transactions.length > 0 && (
          <div className="space-y-2.5 my-2">
            {transactions.slice(0, 4).map((tx) => {
              const isDeposit = tx.type === 'INITIAL_DEPOSIT';
              const formattedAmt = isDeposit
                ? `+${formatUSD(tx.amountCents)}`
                : formatUSD(tx.amountCents);

              return (
                <div
                  key={tx.id || tx._id}
                  className="p-3 rounded-xl bg-[#050e18]/80 border border-white/[0.06] flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#00F59B]/10 border border-[#00F59B]/30 flex items-center justify-center text-[#00F59B] flex-shrink-0">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white font-sans flex items-center gap-1.5">
                        <span>{tx.description || 'Initial Virtual Cash Deposit'}</span>
                        <span className="text-[10px] font-mono text-[#00F59B] bg-[#00F59B]/10 px-1.5 py-0.2 rounded">
                          {tx.type}
                        </span>
                      </div>
                      <div className="text-[10px] font-mono text-gray-500 mt-0.5">
                        {formatDate(tx.createdAt)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs sm:text-sm font-extrabold font-mono text-[#00F59B]">
                      {formattedAmt}
                    </div>
                    <div className="text-[10px] font-mono text-gray-500">
                      Balance: {formatUSD(tx.balanceAfterCents)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-gray-500">
        <div className="flex items-center gap-1 text-gray-400">
          <Sparkles className="w-3 h-3 text-[#00F59B]" />
          <span>Server-verified ledger</span>
        </div>
        <span>MongoDB Atlas backed</span>
      </div>
    </div>
  );
};

export default RecentActivity;
