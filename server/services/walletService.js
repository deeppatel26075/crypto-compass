const mongoose = require('mongoose');
const Wallet = require('../models/Wallet');
const WalletTransaction = require('../models/WalletTransaction');
const {
  INITIAL_VIRTUAL_BALANCE_CENTS,
  WALLET_CURRENCY,
  TRANSACTION_TYPES,
} = require('../constants/wallet');

/**
 * Initialize a new virtual wallet with $10,000.00 virtual cash and an auditable ledger record.
 * This function is strictly IDEMPOTENT:
 * If a wallet already exists for the given user, it returns the existing wallet immediately
 * without duplicating initial transactions or mutating the existing balance.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<Wallet>}
 */
const initializeWallet = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required to initialize a virtual wallet.');
  }

  // 1. Idempotency Check: return existing wallet if already initialized
  const existingWallet = await Wallet.findOne({ user: userId });
  if (existingWallet) {
    return existingWallet;
  }

  // 2. Atomically create Wallet and Initial Deposit Ledger entry
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Check again inside transaction to prevent race conditions
    const doubleCheck = await Wallet.findOne({ user: userId }).session(session);
    if (doubleCheck) {
      await session.abortTransaction();
      return doubleCheck;
    }

    const [wallet] = await Wallet.create(
      [
        {
          user: userId,
          cashBalanceCents: INITIAL_VIRTUAL_BALANCE_CENTS,
          currency: WALLET_CURRENCY,
          initialized: true,
        },
      ],
      { session }
    );

    await WalletTransaction.create(
      [
        {
          wallet: wallet._id,
          user: userId,
          type: TRANSACTION_TYPES.INITIAL_DEPOSIT,
          amountCents: INITIAL_VIRTUAL_BALANCE_CENTS,
          currency: WALLET_CURRENCY,
          balanceAfterCents: INITIAL_VIRTUAL_BALANCE_CENTS,
          description: 'Initial virtual balance',
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return wallet;
  } catch (error) {
    await session.abortTransaction();

    // In case transactions are not supported by the environment, fallback to safe sequential creation
    if (
      error.message &&
      (error.message.includes('Transaction numbers are only allowed') ||
        error.message.includes('Transactions are not supported'))
    ) {
      const fallbackWallet = await Wallet.create({
        user: userId,
        cashBalanceCents: INITIAL_VIRTUAL_BALANCE_CENTS,
        currency: WALLET_CURRENCY,
        initialized: true,
      });

      try {
        await WalletTransaction.create({
          wallet: fallbackWallet._id,
          user: userId,
          type: TRANSACTION_TYPES.INITIAL_DEPOSIT,
          amountCents: INITIAL_VIRTUAL_BALANCE_CENTS,
          currency: WALLET_CURRENCY,
          balanceAfterCents: INITIAL_VIRTUAL_BALANCE_CENTS,
          description: 'Initial virtual balance',
        });
        return fallbackWallet;
      } catch (txError) {
        // Rollback orphaned wallet if transaction insert failed
        await Wallet.findByIdAndDelete(fallbackWallet._id);
        throw txError;
      }
    }

    // If another concurrent request already committed the wallet or hit a write conflict, return the existing wallet
    if (
      error.hasErrorLabel && error.hasErrorLabel('TransientTransactionError') ||
      error.code === 112 ||
      error.code === 11000 ||
      (error.message && error.message.includes('duplicate key'))
    ) {
      const existingAfterConflict = await Wallet.findOne({ user: userId });
      if (existingAfterConflict) {
        return existingAfterConflict;
      }
    }

    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Retrieve the virtual wallet for an authenticated user.
 * If the user's wallet is missing (e.g. created prior to Phase 5), auto-initializes idempotently.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<Wallet>}
 */
const getWalletByUserId = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required to fetch virtual wallet.');
  }

  let wallet = await Wallet.findOne({ user: userId });
  if (!wallet) {
    wallet = await initializeWallet(userId);
  }

  return wallet;
};

/**
 * Retrieve transaction history for an authenticated user.
 *
 * @param {string|mongoose.Types.ObjectId} userId
 * @returns {Promise<WalletTransaction[]>}
 */
const getWalletTransactions = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required to fetch transactions.');
  }

  return WalletTransaction.find({ user: userId }).sort({ createdAt: -1 });
};

module.exports = {
  initializeWallet,
  getWalletByUserId,
  getWalletTransactions,
};
