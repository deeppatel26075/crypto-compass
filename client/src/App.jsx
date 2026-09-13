import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MarketsPage from './pages/MarketsPage';
import PortfolioPage from './pages/PortfolioPage';
import LearnPage from './pages/LearnPage';
import ChallengesPage from './pages/ChallengesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Main application router configuration.
 * Sets up all Phase 0 placeholder routes and catches undefined paths.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          {/* Public & Placeholder Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="markets" element={<MarketsPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="challenges" element={<ChallengesPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="profile" element={<ProfilePage />} />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
