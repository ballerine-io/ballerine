import { useAccessToken } from '@/common/providers/AccessTokenProvider';
import { useDependencies } from '@/common/providers/DependenciesProvider';
import { useEndUserQuery } from '@/hooks/useEndUserQuery';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../CollectionFlow/components/atoms/LoadingScreen';

export const Root = () => {
  const { isLoading } = useDependencies();
  const navigate = useNavigate();
  const { accessToken } = useAccessToken();
  const { data: endUser } = useEndUserQuery();

  useEffect(() => {
    if (!isLoading && !endUser) {
      navigate(`/signup?token=${accessToken}`);

      return;
    }

    if (endUser) {
      navigate(`/collection-flow?token=${accessToken}`);

      return;
    }
  }, [isLoading, accessToken, navigate]);

  if (isLoading) return <LoadingScreen />;

  return <Outlet />;
};
