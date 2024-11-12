import { CollectionFlow } from '@/pages/CollectionFlow';
import * as Sentry from '@sentry/react';
import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import { withCustomer } from './hocs/withCustomer';
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
    children: [
      {
        path: '/',
        Component: Root,
        children: [
          {
            path: '',
            Component: withCustomer(CollectionFlow),
          },
          {
            path: 'collection-flow',
            Component: withCustomer(CollectionFlow),
          },
          {
            path: 'signup',
            Component: SignUpPage,
          },
          // TODO: Error Boundary
          // TODO: 404 Page
        ],
      },
    ],
  },
]);
