import React from 'react';
import { User } from 'lucide-react';
import PlaceholderCard from '../components/common/PlaceholderCard';

const ProfilePage = () => {
  return (
    <PlaceholderCard
      title="User Profile & Progress"
      phase="Phase 21"
      icon={User}
      description="Personal trading statistics, mistake analysis summary, level badges (Crypto Explorer -> Crypto Navigator), and account settings."
    />
  );
};

export default ProfilePage;
