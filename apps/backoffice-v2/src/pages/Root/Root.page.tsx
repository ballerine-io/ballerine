import { Outlet } from 'react-router-dom';
import { Providers } from '../../common/components/templates/Providers/Providers';
import { Toaster } from 'react-hot-toast';
import { FunctionComponent, lazy, Suspense } from 'react';
import useWebSocket from 'react-use-websocket';
import { queryClient } from '../../lib/react-query/query-client';
import { workflowsQueryKeys } from '../../domains/workflows/query-keys';
import { storageQueryKeys } from '../../domains/storage/query-keys';
import { filtersQueryKeys } from '../../domains/filters/query-keys';
import { env } from '../../common/env/env';

const ReactQueryDevtools = lazy(() =>
  process.env.NODE_ENV !== 'production'
    ? import('@tanstack/react-query-devtools').then(module => ({
        default: module.ReactQueryDevtools,
      }))
    : Promise.resolve({ default: () => null }),
);

export const Root: FunctionComponent = () => {
  useWebSocket(`${env.VITE_WEBSOCKET_URL}`, {
    share: true,
    shouldReconnect: () => true,
    onOpen: () => {
      console.log('websocket opened');
    },
    onMessage: message => {
      let queryKey = undefined;
      if (message) {
        switch (message.data) {
          case 'filters':
            queryKey = filtersQueryKeys._def;
            break;
          case 'storage':
            queryKey = storageQueryKeys._def;
            break;
          case 'workflow':
            queryKey = workflowsQueryKeys.byId._def;
            break;
          case 'workflows_list':
            queryKey = workflowsQueryKeys.list._def;
            break;
        }
      }
      if (queryKey) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        void queryClient.invalidateQueries(queryKey);
      }
    },
  });

  return (
    <Providers>
      <Toaster
        toastOptions={{
          position: 'top-center',
          // In milliseconds
          duration: 1000 * 3,
        }}
      />
      <Outlet />
      <Suspense>
        <ReactQueryDevtools />
      </Suspense>
    </Providers>
  );
};
