import { Header } from 'components/organisms/Header';
import { FunctionComponentWithChildren } from '../../../types';

export const AuthenticatedLayout: FunctionComponentWithChildren = ({ children }) => {
  // useAuthenticatedLayout();

  return (
    <div className="drawer-mobile drawer">
      <input id="app-drawer" type="checkbox" className="drawer-toggle" />
      <div className={`drawer-content`}>
        <main className={`grid h-full grid-cols-[285px_1fr]`}>
          {/*<Outlet />*/}
          {children}
        </main>
      </div>
      <div className={`drawer-side w-56`}>
        <label htmlFor="app-drawer" className="drawer-overlay"></label>
        <Header />
      </div>
      <label
        htmlFor="app-drawer"
        className="btn drawer-button btn-square fixed z-50 bottom-right-6 lg:hidden"
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
