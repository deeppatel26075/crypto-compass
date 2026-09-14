import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check active session on initial application load
  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
        return res.user;
      }
      setUser(null);
      return null;
    } catch (err) {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  // Log in user
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.user) {
        setUser(res.user);
        return res.user;
      }
      throw new Error(res.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  // Register user
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.success && res.user) {
        setUser(res.user);
        return res.user;
      }
      throw new Error(res.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  // Log out user
  const logout = async () => {
    setLoading(true);
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.warn('Logout notification error:', err);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
