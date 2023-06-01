import { ReactRouter as TanStackRouter, RouterProvider } from '@tanstack/react-router';
import React, { FunctionComponent } from 'react';
import { rootRoute } from '../routes/Root/Root.route';
import { caseManagementRoute } from '../routes/CaseManagement/CaseManagement.route';
import { caseManagementIndexRoute } from '../routes/CaseManagement/CaseManagementIndex.route';
import { entitiesRoute } from '../routes/Entities/Entities.route';
import { entityRoute } from '../routes/Entity/Entity.route';
import { rootIndexRoute } from '../routes/Root/RootIndex.route';
import { signInRoute } from '../routes/SignIn/SignIn.route';
import { entitiesIndexRoute } from '../routes/Entities/EntitiesIndex.route';
import { env } from '../common/env/env';
import { createBrowserRouter, RouterProvider as ReactRouterProvider } from 'react-router-dom';

declare module '@tanstack/react-router' {
  interface Register {
    // @ts-ignore
    router: typeof router;
  }
}

const routes = [
  rootIndexRoute,
  ...(env.VITE_AUTH_ENABLED ? [signInRoute] : []),
  caseManagementRoute.addChildren([
    caseManagementIndexRoute,
    entitiesRoute.addChildren([entitiesIndexRoute, entityRoute]),
    // transactionsRoute.addChildren([transactionsIndexRoute]),
  ]),
];

// Declare the routes and their children routes
const routeTree = rootRoute.addChildren(routes);

// Router to pass to the RouterProvider
export const router = new TanStackRouter({
  routeTree,
  defaultPreload: 'intent',
});

// Used by App, exported here in case we want to include more providers in App or run logic before the RouterProvider
export const Router: FunctionComponent = () => {
  return <RouterProvider router={router} />;
};

const reactRouter = createBrowserRouter([
  {
    path: '/',
    element: <div>Hello world!</div>,
  },
]);

export const ReactRouter: FunctionComponent = () => {
  return <ReactRouterProvider router={reactRouter} />;
};
