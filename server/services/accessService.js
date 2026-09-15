const VirtualAccess = require('../models/VirtualAccess');
const Wallet = require('../models/Wallet');
const walletService = require('./walletService');
const {
  VIRTUAL_ACCESS_PRICE_PAISE,
  PROMO_COUPON_CODE,
  ACCESS_STATUS,
  UNLOCK_SOURCE,
} = require('../constants/access');

/**
 * Check user access status in a strictly READ-ONLY manner.
 * Zero database writes or document mutations occur in this function.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<Object>} Safe access status representation
 */
const checkAccess = async (userId) => {
  if (!userId) {
    return {
      unlocked: false,
      status: ACCESS_STATUS.LOCKED,
      pricePaise: VIRTUAL_ACCESS_PRICE_PAISE,
      priceINR: Math.round(VIRTUAL_ACCESS_PRICE_PAISE / 100),
      discountPaise: 0,
      discountINR: 0,
      finalAmountPaise: VIRTUAL_ACCESS_PRICE_PAISE,
      finalAmountINR: Math.round(VIRTUAL_ACCESS_PRICE_PAISE / 100),
      couponCode: null,
      unlockSource: null,
      unlockedAt: null,
    };
  }

  // 1. Check if an explicit VirtualAccess record exists
  const accessDoc = await VirtualAccess.findOne({ user: userId });
  if (accessDoc) {
    return accessDoc.toSafeJSON();
  }

  // 2. If no VirtualAccess document exists, check for an existing legacy Wallet (read-only)
  const existingWallet = await Wallet.findOne({ user: userId });
  if (existingWallet) {
    return {
      unlocked: true,
      status: ACCESS_STATUS.UNLOCKED,
      pricePaise: VIRTUAL_ACCESS_PRICE_PAISE,
      priceINR: Math.round(VIRTUAL_ACCESS_PRICE_PAISE / 100),
      discountPaise: VIRTUAL_ACCESS_PRICE_PAISE,
      discountINR: Math.round(VIRTUAL_ACCESS_PRICE_PAISE / 100),
      finalAmountPaise: 0,
      finalAmountINR: 0,
      couponCode: null,
      unlockSource: UNLOCK_SOURCE.LEGACY_PROVISIONED,
      unlockedAt: existingWallet.createdAt || null,
    };
  }

  // 3. User has neither VirtualAccess nor Wallet -> default locked state (no DB write)
  return {
    unlocked: false,
    status: ACCESS_STATUS.LOCKED,
    pricePaise: VIRTUAL_ACCESS_PRICE_PAISE,
    priceINR: Math.round(VIRTUAL_ACCESS_PRICE_PAISE / 100),
    discountPaise: 0,
    discountINR: 0,
    finalAmountPaise: VIRTUAL_ACCESS_PRICE_PAISE,
    finalAmountINR: Math.round(VIRTUAL_ACCESS_PRICE_PAISE / 100),
    couponCode: null,
    unlockSource: null,
    unlockedAt: null,
  };
};

/**
 * Redeem promo coupon code to unlock virtual access and provision starting virtual wallet.
 * Sequential and resilient:
 * 1. Validates coupon code strictly (CRYPTO100, trimmed, case-insensitive).
 * 2. Idempotency: If access is already unlocked, safely returns current representation.
 * 3. Provisions or verifies ,000 virtual wallet via walletService.initializeWallet(userId).
 * 4. Updates / upserts VirtualAccess to UNLOCKED status.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @param {string} rawCouponCode
 * @returns {Promise<Object>} Safe access status representation
 */
const redeemAndUnlock = async (userId, rawCouponCode) => {
  if (!userId) {
    const error = new Error('User authentication required.');
    error.statusCode = 401;
    throw error;
  }

  const normalizedCoupon = String(rawCouponCode || '').trim().toUpperCase();

  if (!normalizedCoupon) {
    const error = new Error('Coupon code is required.');
    error.statusCode = 400;
    throw error;
  }

  if (normalizedCoupon !== PROMO_COUPON_CODE) {
    const error = new Error('Invalid coupon code. Please enter a valid promotional code.');
    error.statusCode = 400;
    throw error;
  }

  // Idempotency check: if user already has an UNLOCKED VirtualAccess record
  const existingAccess = await VirtualAccess.findOne({ user: userId });
  if (existingAccess && existingAccess.status === ACCESS_STATUS.UNLOCKED) {
    // Ensure wallet is initialized just in case
    await walletService.initializeWallet(userId);
    return existingAccess.toSafeJSON();
  }

  // Check if legacy user who already has a wallet
  const existingWallet = await Wallet.findOne({ user: userId });
  if (existingWallet && !existingAccess) {
    const legacyDoc = await VirtualAccess.create({
      user: userId,
      status: ACCESS_STATUS.UNLOCKED,
      pricePaise: VIRTUAL_ACCESS_PRICE_PAISE,
      discountPaise: VIRTUAL_ACCESS_PRICE_PAISE,
      finalAmountPaise: 0,
      couponCode: PROMO_COUPON_CODE,
      unlockSource: UNLOCK_SOURCE.LEGACY_PROVISIONED,
      unlockedAt: new Date(),
    });
    return legacyDoc.toSafeJSON();
  }

  // 1. Provision virtual wallet first (idempotent, guarantees initial ,000 virtual balance)
  await walletService.initializeWallet(userId);

  // 2. Mark VirtualAccess as UNLOCKED
  const updatedAccess = await VirtualAccess.findOneAndUpdate(
    { user: userId },
    {
      status: ACCESS_STATUS.UNLOCKED,
      pricePaise: VIRTUAL_ACCESS_PRICE_PAISE,
      discountPaise: VIRTUAL_ACCESS_PRICE_PAISE,
      finalAmountPaise: 0,
      couponCode: PROMO_COUPON_CODE,
      unlockSource: UNLOCK_SOURCE.COUPON,
      unlockedAt: new Date(),
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  return updatedAccess.toSafeJSON();
};

module.exports = {
  checkAccess,
  redeemAndUnlock,
};
