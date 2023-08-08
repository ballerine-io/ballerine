import { useSignin } from '@app/hooks/useSignin/useSignin';
import { Navigate } from 'react-router-dom';

export function withSessionProtected<TComponentProps extends object>(
  Component: React.ComponentType<TComponentProps>,
  signinPath = '/signin',
): React.ComponentType<TComponentProps> {
  function Wrapper(props: TComponentProps) {
    const { user } = useSignin();

    const isAuthenticated = Boolean(user);

    if (!isAuthenticated) return <Navigate to={signinPath} />;

    return <Component {...props} />;
  }
  Wrapper.displayName = `withSessionProtected(${Component.displayName})`;

  return Wrapper;
}
