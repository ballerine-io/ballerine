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
import { ErrorScreen } from './common/components/organisms/ErrorScreen/ErrorScreen';
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
            path: '',
            Component: CollectionFlow,
          },
          {
            path: 'collection-flow',
            Component: CollectionFlow,
          },
          {
            path: 'signup',
            Component: SignUpPage,
          },
        ],
      },
    ],
  },
]);
