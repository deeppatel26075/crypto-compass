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
import DesignSystemPage from './pages/DesignSystemPage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Main application router configuration.
 * - Route '/' renders the full-bleed Phase 2 Cinematic Landing Page.
 * - Dashboard and authenticated shell routes render inside RootLayout (with sidebar).
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Phase 2 Cinematic Landing Page (Full-Width Public Shell) */}
        <Route path="/" element={<HomePage />} />

        {/* Application Shell Routes (Sidebar + Top Search) */}
        <Route element={<RootLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="markets" element={<MarketsPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="challenges" element={<ChallengesPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

          {/* Phase 1 Design System Showcase */}
          <Route path="design-system" element={<DesignSystemPage />} />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
