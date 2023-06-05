import { Outlet } from 'react-router-dom';
import { Providers } from '../../common/components/templates/Providers/Providers';
import { Toaster } from 'react-hot-toast';
import { Layout } from '../../common/components/templates/Layout/Layout';
import { FunctionComponent, lazy, Suspense } from 'react';

const ReactQueryDevtools = lazy(() =>
  process.env.NODE_ENV !== 'production'
    ? import('@tanstack/react-query-devtools').then(module => ({
        default: module.ReactQueryDevtools,
      }))
    : Promise.resolve({ default: () => null }),
);

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
      <Suspense>
        <ReactQueryDevtools />
      </Suspense>
    </Providers>
  );
};
