import React, { useState, useEffect } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import StatsBar from '../components/landing/StatsBar';
import FeatureSection from '../components/landing/FeatureSection';
import LandingFooter from '../components/landing/LandingFooter';
import DemoModal from '../components/landing/DemoModal';
import GlobalSearchModal from '../components/common/GlobalSearchModal';

export default function HomePage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener on landing page
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenSearch = () => {
    setIsSearchOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#020609] text-gray-200 overflow-x-hidden selection:bg-[#00F59B]/30 selection:text-[#00F59B]">
      {/* 1. Transparent Glass Navigation Header */}
      <LandingNavbar onOpenSearch={handleOpenSearch} />

      {/* 2. Cinematic Hero Section with authentic background & 3D Three.js crypto scene */}
      <HeroSection onOpenDemo={() => setIsDemoOpen(true)} />

      {/* 3. Glassmorphism Statistics Panel with showcase metrics */}
      <StatsBar />

      {/* 4. "Why Crypto Compass" Feature Section with 4 Glass Interactive Cards */}
      <FeatureSection />

      {/* 5. Comprehensive Cosmic Landing Footer */}
      <LandingFooter />

      {/* 6. Interactive Video / Walkthrough Preview Modal */}
      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />

      {/* 7. Global Search Modal */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </div>
  );
}
