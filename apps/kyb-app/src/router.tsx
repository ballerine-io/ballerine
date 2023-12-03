import { withTokenProtected } from '@/hocs/withTokenProtected';
import { CollectionFlow } from '@/pages/CollectionFlow';
import { Approved } from '@/pages/CollectionFlow/components/pages/Approved';
import { Rejected } from '@/pages/CollectionFlow/components/pages/Rejected';
import { SignIn } from '@/pages/SignIn';
import {
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';
import * as Sentry from '@sentry/react';
import React from 'react';

export const sentyRouterInstrumentation = Sentry.reactRouterV6Instrumentation(
  React.useEffect,
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
);

const sentryCreateBrowserRouter = Sentry.wrapCreateBrowserRouter(createBrowserRouter);

export const router = sentryCreateBrowserRouter([
  {
    path: '/',
    Component: withTokenProtected(SignIn),
  },
  {
    path: '/collection-flow',
    Component: withTokenProtected(CollectionFlow),
  },
  {
    path: 'rejected',
    Component: withTokenProtected(Rejected),
  },
  {
    path: 'approved',
    Component: withTokenProtected(Approved),
  },
]);
