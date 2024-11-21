import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useIsSignupRequired } from './hooks/useIsSignupRequired';

export const Root = () => {
  const { isLoading, isSignupRequired } = useIsSignupRequired();
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
    }
  }, [isSignupRequired, isLoading]);

  return <Outlet />;
};
