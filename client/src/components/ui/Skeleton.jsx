import React from 'react';

/**
 * Shimmering Skeleton Loader Components
 */
export const Skeleton = ({ className = '', rounded = 'rounded-lg' }) => {
  return (
    <div
      className={`bg-space-750/80 relative overflow-hidden animate-pulse ${rounded} ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent animate-[shimmer_1.8s_infinite]" />
    </div>
  );
};

export const CardSkeleton = ({ className = '' }) => {
  return (
    <div className={`p-4 rounded-xl bg-space-850/60 border border-white/[0.06] space-y-3 ${className}`}>
      <div className="flex items-center gap-3">
        <Skeleton className="w-9 h-9" rounded="rounded-xl" />
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-3 w-1/2" />
          <Skeleton className="h-2.5 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-4 w-3/4" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
};

export default Skeleton;
