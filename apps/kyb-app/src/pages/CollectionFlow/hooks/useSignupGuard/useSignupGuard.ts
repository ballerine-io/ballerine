import { useIsSignupRequired } from '@/pages/Root/hooks/useIsSignupRequired';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useSignupGuard = () => {
  const { isSignupRequired } = useIsSignupRequired();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignupRequired) {
      navigate('/signup');
    }
  }, [isSignupRequired, navigate]);
};
