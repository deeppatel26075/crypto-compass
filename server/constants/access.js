/**
 * Phase 26 — Virtual Access Pricing & Coupon Gate Constants
 *
 * Internal financial representation:
 * INR currency is represented as integer paise (1 INR = 100 paise).
 * 999 INR = 99900 paise.
 */

const VIRTUAL_ACCESS_PRICE_PAISE = 99900; // ₹999.00 INR
const PROMO_COUPON_CODE = 'CRYPTO100';
const PROMO_DISCOUNT_PERCENT = 100;

const ACCESS_STATUS = {
  LOCKED: 'LOCKED',
  UNLOCKED: 'UNLOCKED',
};

const UNLOCK_SOURCE = {
  COUPON: 'COUPON',
  LEGACY_PROVISIONED: 'LEGACY_PROVISIONED',
};

module.exports = {
  VIRTUAL_ACCESS_PRICE_PAISE,
  PROMO_COUPON_CODE,
  PROMO_DISCOUNT_PERCENT,
  ACCESS_STATUS,
  UNLOCK_SOURCE,
};
