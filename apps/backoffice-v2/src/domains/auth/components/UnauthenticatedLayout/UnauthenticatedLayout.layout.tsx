import { useUnauthenticatedLayoutLogic } from './hooks/useUnauthenticatedLayoutLogic/useUnauthenticatedLayoutLogic';
import { Navigate, Outlet } from 'react-router-dom';
import { FunctionComponent } from 'react';

export const UnauthenticatedLayout: FunctionComponent = () => {
  const { isLoading, shouldRedirect, redirectAuthenticatedTo, state } =
    useUnauthenticatedLayoutLogic();

  if (isLoading) return null;

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
