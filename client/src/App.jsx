import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccessPage from './pages/AccessPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import MarketsPage from './pages/MarketsPage';
import MarketDetailPage from './pages/MarketDetailPage';
import PortfolioPage from './pages/PortfolioPage';
import TradingHistoryPage from './pages/TradingHistoryPage';
import LearnPage from './pages/LearnPage';
import LessonPage from './pages/LessonPage';
import QuizPage from './pages/QuizPage';
import ScenariosPage from './pages/ScenariosPage';
import ScenarioPage from './pages/ScenarioPage';
import SimulatorPage from './pages/SimulatorPage';
import AnalysisPage from './pages/AnalysisPage';
import ChallengesPage from './pages/ChallengesPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

/**
 * Main application router configuration with Phase 3 Authentication & Phase 26 Access Gate.
 * - Public: '/' (Cinematic Landing), '/login', '/register'
 * - Access Gate: '/access' (Authenticated, requireAccess=false)
 * - Onboarding: '/onboarding' (Authenticated & Access Unlocked, requireOnboardingComplete=false)
 * - Authenticated & Protected: '/dashboard', '/markets', '/portfolio', '/learn', '/challenges', '/leaderboard', '/profile'
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

          {/* 2. Phase 26 Virtual Access Pricing & Coupon Gate */}
          <Route
            path="/access"
            element={
              <ProtectedRoute requireAccess={false} requireOnboardingComplete={false}>
                <AccessPage />
              </ProtectedRoute>
            }
          />

          {/* 3. Authenticated Onboarding Route */}
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute requireAccess={true} requireOnboardingComplete={false}>
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
            <Route path="markets/:symbol" element={<MarketDetailPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="history" element={<TradingHistoryPage />} />
            <Route path="learn" element={<LearnPage />} />
            <Route path="learn/:lessonId" element={<LessonPage />} />
            <Route path="quiz/:quizId" element={<QuizPage />} />
            <Route path="scenarios" element={<ScenariosPage />} />
            <Route path="scenarios/:scenarioId" element={<ScenarioPage />} />
            <Route path="simulator" element={<SimulatorPage />} />
            <Route path="analysis" element={<AnalysisPage />} />
            <Route path="challenges" element={<ChallengesPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* 4. Catch-all 404 Route */}
          <Route element={<RootLayout />}>
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
