import { Outlet } from 'react-router-dom';
import { Providers } from '../../common/components/templates/Providers/Providers';
import { Toaster } from 'react-hot-toast';
import { Layout } from '../../common/components/templates/Layout/Layout';
import { FunctionComponent } from 'react';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const Root: FunctionComponent = () => {
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
    </Providers>
  );
};
