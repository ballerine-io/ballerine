import { withTokenProtected } from '@/hocs/withTokenProtected';
import { CollectionFlow } from '@/pages/CollectionFlow';
import { Approved } from '@/pages/CollectionFlow/components/pages/Approved';
import { Rejected } from '@/pages/CollectionFlow/components/pages/Rejected';
import { CollectionFlowV2 } from '@/pages/CollectionFlowV2';
import { SignIn } from '@/pages/SignIn';
import * as Sentry from '@sentry/react';
import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from 'react-router-dom';

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
  {
    path: '/v2',
    children: [
      {
        path: 'collection-flow',
        Component: withTokenProtected(CollectionFlowV2),
      },
      {
        path: 'rejected',
        Component: withTokenProtected(Rejected),
      },
      {
        path: 'approved',
        Component: withTokenProtected(Approved),
      },
    ],
  },
]);
