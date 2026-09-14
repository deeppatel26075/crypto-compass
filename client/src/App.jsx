import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import MarketsPage from './pages/MarketsPage';
import PortfolioPage from './pages/PortfolioPage';
import LearnPage from './pages/LearnPage';
import ChallengesPage from './pages/ChallengesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import DesignSystemPage from './pages/DesignSystemPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Main application router configuration with Phase 3 Authentication.
 * - Public: '/' (Cinematic Landing), '/login', '/register'
 * - Authenticated & Protected: '/onboarding', '/dashboard', '/markets', '/portfolio', '/learn', '/challenges', '/leaderboard', '/profile'
 * - Design System Showcase: '/design-system' (in RootLayout)
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 1. Public Standalone Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 2. Authenticated Onboarding Route */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />

          {/* 3. Protected Application Shell Routes (Sidebar + Header) */}
          <Route
            element={
              <ProtectedRoute>
                <RootLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="markets" element={<MarketsPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="learn" element={<LearnPage />} />
            <Route path="challenges" element={<ChallengesPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* 4. Public App Shell View for Design System Showcase */}
          <Route element={<RootLayout />}>
            <Route path="design-system" element={<DesignSystemPage />} />
            {/* Catch-all 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
