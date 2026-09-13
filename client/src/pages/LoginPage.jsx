import React from 'react';
import { LogIn } from 'lucide-react';
import PlaceholderCard from '../components/common/PlaceholderCard';

const LoginPage = () => {
  return (
    <PlaceholderCard
      title="User Login"
      phase="Phase 3"
      icon={LogIn}
      description="Secure JWT authentication login portal with form validation and session management."
    />
  );
};

export default LoginPage;
