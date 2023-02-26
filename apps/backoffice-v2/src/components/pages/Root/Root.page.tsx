import { Outlet } from '@tanstack/react-router';
import React from 'react';
import { Providers } from 'components/templates/Providers/Providers';
import { Toaster } from 'react-hot-toast';
import { Layout } from 'components/templates/Layout/Layout';

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
      {/*<ReactQueryDevtools />*/}
      {/*<TanStackRouterDevtools initialIsOpen={false} />*/}
    </Providers>
  );
};
