import { useUnauthenticatedLayoutLogic } from './hooks/useUnauthenticatedLayoutLogic/useUnauthenticatedLayoutLogic';
import { Navigate, Outlet } from 'react-router-dom';
import { FunctionComponent } from 'react';
import { FullScreenLoader } from '../../../../common/components/molecules/FullScreenLoader/FullScreenLoader';

export const UnauthenticatedLayout: FunctionComponent = () => {
  const { isLoading, shouldRedirect, redirectAuthenticatedTo, state } =
    useUnauthenticatedLayoutLogic();

  if (isLoading) return <FullScreenLoader />;

  if (shouldRedirect) {
    return (
      <Navigate
        to={redirectAuthenticatedTo}
        replace
        state={{
          from: state?.from,
        }}
      />
    );
  }

  return (
    <main className={`h-full`}>
      <Outlet />
    </main>
  );
};
