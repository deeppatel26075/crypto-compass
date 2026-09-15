import api from './api';

/**
 * Crypto Compass — Client Wallet Service
 *
 * Consumes the authenticated /api/wallet endpoints.
 * All financial state is maintained on the server / MongoDB Atlas.
 */

/**
 * Fetch the authenticated user's virtual wallet
 * @returns {Promise<{ id: string, currency: string, cashBalanceCents: number, cashBalance: number, initialized: boolean }>}
 */
export const getWallet = async () => {
  const res = await api.get('/wallet');
  return res.wallet;
};

/**
 * Fetch the authenticated user's transaction ledger
 * @returns {Promise<Array<{ id: string, type: string, amountCents: number, amount: number, currency: string, balanceAfterCents: number, description: string, createdAt: string }>>}
 */
export const getWalletTransactions = async () => {
  const res = await api.get('/wallet/transactions');
  return res.transactions;
};

export default {
  getWallet,
  getWalletTransactions,
};
