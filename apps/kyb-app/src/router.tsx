import { CollectionFlow } from '@/pages/CollectionFlow';
import * as Sentry from '@sentry/react';
import { motion } from 'motion/react';
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
          {
            path: 'test',
            Component: () => (
              <motion.div
                initial={{ x: '100%', opacity: 1 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                style={{ width: '100%', height: '100vh', backgroundColor: 'lightblue' }}
              >
                c60c740a-34ac-4b39-b67b-4e3868497a74
              </motion.div>
            ),
          },
          // TODO: 404 Page?
        ],
      },
    ],
  },
]);
