import api from './api';

export const accessService = {
  /**
   * Get virtual access status and pricing breakdown (read-only)
   */
  getStatus: async () => {
    const response = await api.get('/access/status');
    return response.data;
  },

  /**
   * Redeem promo coupon (e.g. CRYPTO100) to unlock virtual access & provision starting wallet
   */
  redeem: async (couponCode) => {
    const response = await api.post('/access/redeem', { couponCode });
    return response.data;
  },
};

export default accessService;
