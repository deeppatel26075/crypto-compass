/**
 * Formatting utilities for Crypto Compass Market Data
 */

/**
 * Formats standard price with dynamic precision based on magnitude
 * Examples:
 *   $64,280.00
 *   $1.45
 *   $0.123456
 */
export const formatPrice = (price) => {
  if (typeof price !== 'number' || isNaN(price)) return '$0.00';

  if (price >= 1000) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  }

  if (price >= 1) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price);
  }

  // Low priced tokens
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4,
    maximumFractionDigits: 6,
  }).format(price);
};

/**
 * Formats large USD amounts compactly ($1.53T, $42.8B, $320.5M)
 */
export const formatCompactUSD = (val) => {
  if (typeof val !== 'number' || isNaN(val) || val === 0) return '$0.00';

  if (val >= 1e12) {
    return `$${(val / 1e12).toFixed(2)}T`;
  }
  if (val >= 1e9) {
    return `$${(val / 1e9).toFixed(2)}B`;
  }
  if (val >= 1e6) {
    return `$${(val / 1e6).toFixed(2)}M`;
  }
  if (val >= 1e3) {
    return `$${(val / 1e3).toFixed(2)}K`;
  }
  return formatPrice(val);
};

/**
 * Formats signed 24h percentage change with accessible indicator
 */
export const formatPercentage = (change) => {
  if (typeof change !== 'number' || isNaN(change)) return '0.00%';
  const sign = change > 0 ? '+' : '';
  return `${sign}${change.toFixed(2)}%`;
};
