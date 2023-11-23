import { setRefererUrl } from '@/common/hocs/withSessionProtected/utils/set-referer-url';
import { useSession } from '@/common/hooks/useSession';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner';
import { useLayoutEffect } from 'react';
import { Navigate } from 'react-router-dom';

export function withSessionProtected<TComponentProps extends object>(
  Component: React.ComponentType<TComponentProps>,
  signinPath = '/auth/signin',
): React.ComponentType<TComponentProps> {
  function Wrapper(props: TComponentProps) {
    const { isAuthenticated, isLoading } = useSession();

    useLayoutEffect(() => {
      if (!isLoading && !isAuthenticated && location.pathname !== signinPath) {
        setRefererUrl(location.pathname);
      }
    }, [isAuthenticated, isLoading]);

    if (isLoading) {
      return (
        <div className="flex h-full flex-col items-center justify-center">
          <LoadingSpinner />
        </div>
      );
    }

    if (!isAuthenticated) return <Navigate to={signinPath} />;

    return <Component {...props} />;
  }
  Wrapper.displayName = `withSessionProtected(${Component.displayName})`;

  return Wrapper;
}
