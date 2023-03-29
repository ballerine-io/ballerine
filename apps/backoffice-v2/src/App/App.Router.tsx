import { ReactRouter, RouterProvider } from '@tanstack/react-router';
import React, { FunctionComponent } from 'react';
import { rootRoute } from '@/components/pages/Root/Root.route';
import { caseManagementRoute } from '@/components/pages/CaseManagement/CaseManagement.route';
import { caseManagementIndexRoute } from '@/components/pages/CaseManagement/CaseManagementIndex.route';
import { individualsRoute } from '@/components/pages/Individuals/Individuals.route';
import { individualRoute } from '@/components/pages/Individual/Individual.route';
import { rootIndexRoute } from '@/components/pages/Root/RootIndex.route';
import { signInRoute } from '@/components/pages/SignIn/SignIn.route';
import { individualsIndexRoute } from '@/components/pages/Individuals/IndividualsIndex.route';
import { env } from '@/env/env';

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
    individualsRoute.addChildren([individualsIndexRoute, individualRoute]),
    // companiesRoute.addChildren([companiesIndexRoute]),
    // transactionsRoute.addChildren([transactionsIndexRoute]),
  ]),
];

// Declare the routes and their children routes
const routeTree = rootRoute.addChildren(routes);

// Router to pass to the RouterProvider
export const router = new ReactRouter({
  routeTree,
  defaultPreload: 'intent',
});

// Used by App, exported here in case we want to include more providers in App or run logic before the RouterProvider
export const Router: FunctionComponent = () => {
  return <RouterProvider router={router} />;
};
