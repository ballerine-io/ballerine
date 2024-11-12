import { LoadingScreen } from '@/common/components/molecules/LoadingScreen';
import { AppNavigate } from '@/common/components/organisms/NavigateWithToken';
import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { Outlet } from 'react-router-dom';
import { useIsSignupRequired } from './hooks/useIsSignupRequired';

export const Root = () => {
  const { isLoading, isSignupRequired } = useIsSignupRequired();
  const { accessToken } = useAccessToken();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (isSignupRequired) {
    return <AppNavigate to={'/signup'} />;
  }

  return <Outlet />;
};
