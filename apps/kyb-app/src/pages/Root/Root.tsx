import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { AnimatePresence } from 'motion/react';
import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useIsSignupRequired } from './hooks/useIsSignupRequired';

export const Root = () => {
  const { isLoading, isSignupRequired } = useIsSignupRequired();
  const location = useLocation();
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();

  useEffect(() => {
    if (isLoading) return;

    if (!isSignupRequired) {
      void navigate(`/collection-flow?token=${accessToken}`);
    }
  }, [isSignupRequired, isLoading]);

  useEffect(() => {
    if (isLoading) return;

    if (isSignupRequired) {
      void navigate(`/signup?token=${accessToken}`);
      console.log('navigate');
    }
  }, [isSignupRequired, isLoading]);

  return (
    <AnimatePresence mode="wait">
      <Outlet />
    </AnimatePresence>
  );
};
