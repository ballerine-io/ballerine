import * as Sentry from '@sentry/react';
import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { ErrorScreen } from './common/components/organisms/ErrorScreen/ErrorScreen';
import { withCustomer } from './hocs/withCustomer';
import { CollectionFlow } from './pages/CollectionFlow/CollectionFlow';
import { GlobalProviders } from './pages/GlobalProviders';
import { Root } from './pages/Root';
import { SignUpPage } from './pages/SignUpPage';

export const sentryRouterInstrumentation = Sentry.reactRouterV6Instrumentation(
  React.useEffect,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
);

const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouter(createBrowserRouter);

export const router = sentryCreateBrowserRouter([
  {
    path: '',
    Component: GlobalProviders,
    errorElement: <ErrorScreen />,
    children: [
      {
        path: '/',
        Component: Root,
        children: [
          {
            path: 'collection-flow',
            Component: withCustomer(CollectionFlow),
          },
          {
            path: 'signup',
            Component: SignUpPage,
          },
          {
            path: '*',
            element: (
              <div className="flex min-h-screen flex-col items-center justify-center gap-4">
                <h1 className="text-2xl font-bold">Page Not Found</h1>
                <p className="text-muted-foreground">
                  The page you are looking for does not exist.
                </p>
              </div>
            ),
          },
        ],
      },
    ],
  },
]);
