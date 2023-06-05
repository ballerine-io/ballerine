import { FunctionComponentWithChildren } from '../../../../common/types';

export const UnauthenticatedLayout: FunctionComponentWithChildren = ({ children }) => {
  // Should only be uncommented once `useAuthRedirects` is no longer in use in `AuthProvider`
  // useUnauthenticatedLayout();

  return (
    <main className={`h-full`}>
      {/*<Outlet />*/}
      {children}
    </main>
  );
};
