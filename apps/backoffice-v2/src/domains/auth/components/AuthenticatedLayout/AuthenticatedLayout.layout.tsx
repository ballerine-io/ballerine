import { Header } from '../../../../common/components/organisms/Header';
import { useAuthenticatedLayoutLogic } from './hooks/useAuthenticatedLayoutLogic/useAuthenticatedLayoutLogic';
import { Navigate, Outlet } from 'react-router-dom';
import { FunctionComponent } from 'react';
import { FullScreenLoader } from '../../../../common/components/molecules/FullScreenLoader/FullScreenLoader';

export const AuthenticatedLayout: FunctionComponent = () => {
  const { shouldRedirect, isLoading, redirectUnauthenticatedTo, location } =
    useAuthenticatedLayoutLogic();

  if (isLoading) return <FullScreenLoader />;

  if (shouldRedirect) {
    return (
      <Navigate
        to={redirectUnauthenticatedTo}
        replace
        state={{
          from: location,
        }}
      />
    );
  }

  return (
    <div className="drawer drawer-mobile">
      <input id="app-drawer" type="checkbox" className="drawer-toggle" />
      <div className={`drawer-content`}>
        <main className={`grid h-full grid-cols-[300px_1fr]`}>
          <Outlet />
        </main>
      </div>
      <div className={`drawer-side w-[250px]`}>
        <label htmlFor="app-drawer" className="drawer-overlay"></label>
        <Header />
      </div>
      <label
        htmlFor="app-drawer"
        className="btn btn-square drawer-button fixed z-50 bottom-right-6 lg:hidden"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </label>
    </div>
  );
};
