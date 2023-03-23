import { useUnauthenticatedLayout } from 'components/templates/UnauthenticatedLayout/hooks/useUnauthenticatedLayout/useUnauthenticatedLayout';
import { FunctionComponentWithChildren } from '../../../types';

export const UnauthenticatedLayout: FunctionComponentWithChildren = ({ children }) => {
  useUnauthenticatedLayout();

  return (
    <main className={`h-full`}>
      {/*<Outlet />*/}
      {children}
    </main>
  );
};
