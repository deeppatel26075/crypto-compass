import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import VirtualWalletCard from '../components/wallet/VirtualWalletCard';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import DashboardStatCards from '../components/dashboard/DashboardStatCards';
import RecommendedNextStep from '../components/dashboard/RecommendedNextStep';
import LearningProgressCard from '../components/dashboard/LearningProgressCard';
import MarketOverview from '../components/dashboard/MarketOverview';
import RecentActivity from '../components/dashboard/RecentActivity';
import QuickActions from '../components/dashboard/QuickActions';
import { getWallet, getWalletTransactions } from '../services/walletService';

const DashboardPage = () => {
  const { user } = useAuth();

  // Virtual wallet state
  const [wallet, setWallet] = useState(null);
  const [walletLoading, setWalletLoading] = useState(true);
  const [walletError, setWalletError] = useState(null);

  // Transactions ledger state
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);
  const [txError, setTxError] = useState(null);

  const fetchWalletData = useCallback(async () => {
    try {
      setWalletLoading(true);
      const data = await getWallet();
      setWallet(data);
      setWalletError(null);
    } catch (err) {
      setWalletError(err.message || 'Could not load your virtual wallet.');
    } finally {
      setWalletLoading(false);
    }
  }, []);

  const fetchTransactionsData = useCallback(async () => {
    try {
      setTxLoading(true);
      const data = await getWalletTransactions();
      setTransactions(Array.isArray(data) ? data : []);
      setTxError(null);
    } catch (err) {
      setTxError(err.message || 'Could not load wallet activity.');
    } finally {
      setTxLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWalletData();
    fetchTransactionsData();
  }, [fetchWalletData, fetchTransactionsData]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
      {/* 1. Header: Greeting, User Name, Live Date */}
      <DashboardHeader user={user} />

      {/* 2. Top Row: Virtual Wallet & Recommended Next Step */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 flex">
          <VirtualWalletCard
            wallet={wallet}
            loading={walletLoading}
            error={walletError}
          />
        </div>
        <div className="lg:col-span-5 flex">
          <RecommendedNextStep user={user} />
        </div>
      </div>

      {/* 3. Stat Cards: Personalized Onboarding Metrics */}
      <DashboardStatCards user={user} />

      {/* 4. Middle Row: Learning Progress & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <LearningProgressCard />
        </div>
        <div className="lg:col-span-5">
          <QuickActions />
        </div>
      </div>

      {/* 5. Bottom Row: Market Overview (Demo Data) & Recent Activity (Wallet Ledger) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <MarketOverview />
        </div>
        <div className="lg:col-span-5">
          <RecentActivity
            transactions={transactions}
            loading={txLoading}
            error={txError}
            onRetry={fetchTransactionsData}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
