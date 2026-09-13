import axios from 'axios';

/**
 * Centralized Axios instance for Crypto Compass.
 * Consumes the base URL configured in VITE_API_URL.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attaches auth token when present (reserved for Phase 3)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('crypto_compass_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: standardized error unpacking
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

export default api;
