import { AppNavigate } from '@app/common/components/organisms/NavigateWithToken';
import { useSessionQuery } from '@app/hooks/useSessionQuery/useSessionQuery';
import { LoadingScreen } from '@app/pages/CollectionFlow/components/atoms/LoadingScreen';

export function withSessionProtected<TComponentProps extends object>(
  Component: React.ComponentType<TComponentProps>,
  signinPath = '/signin',
): React.ComponentType<TComponentProps> {
  function Wrapper(props: TComponentProps) {
    const { user, isLoading } = useSessionQuery();

    if (isLoading) return <LoadingScreen />;

    const isAuthenticated = Boolean(user);

    if (!isAuthenticated) return <AppNavigate to={signinPath} />;

    return <Component {...props} />;
  }
  Wrapper.displayName = `withSessionProtected(${Component.displayName})`;

  return Wrapper;
}
