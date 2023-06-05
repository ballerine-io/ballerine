import { Outlet } from '@tanstack/react-router';
import { Providers } from '../../common/components/templates/Providers/Providers';
import { Toaster } from 'react-hot-toast';
import { Layout } from '../../common/components/templates/Layout/Layout';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const Root = () => {
  return (
    <Providers>
      <Toaster
        toastOptions={{
          position: 'top-center',
          // In milliseconds
          duration: 1000 * 3,
        }}
      />
      <Layout>
        <Outlet />
      </Layout>
      {/** Excluded in production by default */}
      {/* <ReactQueryDevtools /> */}
      {/*<TanStackRouterDevtools initialIsOpen={false} />*/}
    </Providers>
  );
};
