const walletService = require('../services/walletService');

/**
 * Crypto Compass — Wallet Controller
 *
 * Provides authenticated, user-isolated virtual wallet endpoints.
 * Explicitly does NOT support client-side balance mutations (PUT/PATCH/DELETE).
 */

/**
 * Get virtual wallet details for the authenticated user
 * GET /api/wallet
 */
const getWallet = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const wallet = await walletService.getWalletByUserId(userId);

    return res.status(200).json({
      success: true,
      wallet: wallet.toSafeJSON(),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get transaction ledger for the authenticated user
 * GET /api/wallet/transactions
 */
const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const transactions = await walletService.getWalletTransactions(userId);

    return res.status(200).json({
      success: true,
      transactions: transactions.map((t) => t.toSafeJSON()),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWallet,
  getTransactions,
};
