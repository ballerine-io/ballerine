import { FunctionComponentWithChildren } from '../../../../common/types';

export const UnauthenticatedLayout: FunctionComponentWithChildren = ({ children }) => {
  // useUnauthenticatedLayout();

  return (
    <main className={`h-full`}>
      {/*<Outlet />*/}
      {children}
    </main>
  );
};
