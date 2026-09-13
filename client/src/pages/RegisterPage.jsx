import React from 'react';
import { UserPlus } from 'lucide-react';
import PlaceholderCard from '../components/common/PlaceholderCard';

const RegisterPage = () => {
  return (
    <PlaceholderCard
      title="User Registration"
      phase="Phase 3"
      icon={UserPlus}
      description="New user onboarding gateway that credits each learner with $10,000 in virtual funds for paper trading."
    />
  );
};

export default RegisterPage;
