import { LoadingScreen } from '@/common/components/molecules/LoadingScreen';
import { AppNavigate } from '@/common/components/organisms/NavigateWithToken';
import { useSessionQuery } from '@/hooks/useSessionQuery/useSessionQuery';

export const withSessionProtected = <TComponentProps extends object>(
  Component: React.ComponentType<TComponentProps>,
  signinPath = '/signin',
) => {
  const Wrapper = (props: TComponentProps) => {
    const { user, isLoading } = useSessionQuery();

    if (isLoading) return <LoadingScreen />;

    const isAuthenticated = Boolean(user);

    if (!isAuthenticated) return <AppNavigate to={signinPath} />;

    return <Component {...props} />;
  };
  Wrapper.displayName = `withSessionProtected(${Component.displayName})`;

  return Wrapper;
};
