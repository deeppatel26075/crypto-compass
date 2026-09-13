import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import PlaceholderCard from '../components/common/PlaceholderCard';

const DashboardPage = () => {
  return (
    <PlaceholderCard
      title="Trading & Learning Dashboard"
      phase="Phase 6"
      icon={LayoutDashboard}
      description="Central command center displaying portfolio overview, active positions, daily learning quest, and market movers."
    />
  );
};

export default DashboardPage;
