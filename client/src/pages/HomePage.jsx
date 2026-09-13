import React from 'react';
import { Home } from 'lucide-react';
import PlaceholderCard from '../components/common/PlaceholderCard';

const HomePage = () => {
  return (
    <PlaceholderCard
      title="Landing Page"
      phase="Phase 2"
      icon={Home}
      description="Futuristic landing page with hero, interactive 3D crypto visual, core product philosophy, and onboarding calls to action."
    />
  );
};

export default HomePage;
