import React, { useState } from 'react';
import LandingNavbar from '../components/landing/LandingNavbar';
import HeroSection from '../components/landing/HeroSection';
import StatsBar from '../components/landing/StatsBar';
import FeatureSection from '../components/landing/FeatureSection';
import LandingFooter from '../components/landing/LandingFooter';
import DemoModal from '../components/landing/DemoModal';

export default function HomePage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  const handleOpenSearch = () => {
    // Scroll smoothly to features or trigger quick search
    const el = document.getElementById('why-us');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020609] text-gray-200 overflow-x-hidden selection:bg-[#00F59B]/30 selection:text-[#00F59B]">
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
    </div>
  );
}
