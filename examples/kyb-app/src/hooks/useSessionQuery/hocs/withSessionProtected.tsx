import { useSessionQuery } from '@app/hooks/useSessionQuery/useSessionQuery';
import { useSignin } from '@app/hooks/useSignin/useSignin';
import { LoadingScreen } from '@app/pages/CollectionFlow/components/atoms/LoadingScreen';
import { Navigate } from 'react-router-dom';

export function withSessionProtected<TComponentProps extends object>(
  Component: React.ComponentType<TComponentProps>,
  signinPath = '/signin',
): React.ComponentType<TComponentProps> {
  function Wrapper(props: TComponentProps) {
    const { user, isLoading } = useSessionQuery();

    if (isLoading) return <LoadingScreen />;

    const isAuthenticated = Boolean(user);

    if (!isAuthenticated) return <Navigate to={signinPath} />;

    return <Component {...props} />;
  }
  Wrapper.displayName = `withSessionProtected(${Component.displayName})`;

  return Wrapper;
}
