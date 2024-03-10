import { FunctionComponent, lazy } from 'react';
import { Outlet } from 'react-router-dom';
import { Providers } from '../../common/components/templates/Providers/Providers';
import { ServerDownLayout } from './ServerDown.layout';

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
      <ServerDownLayout>
        <Outlet />
      </ServerDownLayout>
      {/*<Suspense>*/}
      {/*  <ReactQueryDevtools  />*/}
      {/*</Suspense>*/}
    </Providers>
  );
};
