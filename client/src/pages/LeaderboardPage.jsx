import React from 'react';
import { Trophy } from 'lucide-react';
import PlaceholderCard from '../components/common/PlaceholderCard';

const LeaderboardPage = () => {
  return (
    <PlaceholderCard
      title="Educational Leaderboard"
      phase="Phase 20"
      icon={Trophy}
      description="Rankings based on disciplined trading behavior, risk management consistency, quiz performance, and completed learning quests."
    />
  );
};

export default LeaderboardPage;
