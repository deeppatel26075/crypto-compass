import React from 'react';
import { PieChart } from 'lucide-react';
import PlaceholderCard from '../components/common/PlaceholderCard';

const PortfolioPage = () => {
  return (
    <PlaceholderCard
      title="Virtual Portfolio & Holdings"
      phase="Phase 11"
      icon={PieChart}
      description="Detailed portfolio breakdown, asset allocation, realized and unrealized P&L, position risk exposure, and holding duration metrics."
    />
  );
};

export default PortfolioPage;
