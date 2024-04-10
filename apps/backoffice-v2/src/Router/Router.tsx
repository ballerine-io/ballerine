import React, { FunctionComponent } from 'react';
import { env } from '@/common/env/env';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { RootError } from '@/pages/Root/Root.error';
import { Root } from '@/pages/Root/Root.page';
import { SignIn } from '@/pages/SignIn/SignIn.page';
import { Entity } from '@/pages/Entity/Entity.page';
import { Entities } from '@/pages/Entities/Entities.page';
import { RouteError } from '@/common/components/atoms/RouteError/RouteError';
import { CaseManagement } from '@/pages/CaseManagement/CaseManagement.page';
import { rootLoader } from '@/pages/Root/Root.loader';
import { entitiesLoader } from '@/pages/Entities/Entities.loader';
import { authenticatedLayoutLoader } from '@/domains/auth/components/AuthenticatedLayout/AuthenticatedLayout.loader';
import { entityLoader } from '@/pages/Entity/Entity.loader';
import { AuthenticatedLayout } from '@/domains/auth/components/AuthenticatedLayout';
import { UnauthenticatedLayout } from '@/domains/auth/components/UnauthenticatedLayout';
import { Locale } from '@/pages/Locale/Locale.page';
import { unauthenticatedLayoutLoader } from '@/domains/auth/components/UnauthenticatedLayout/UnauthenticatedLayout.loader';
import { Document } from '@/pages/Document/Document.page';
import { NotFoundRedirect } from '@/pages/NotFound/NotFound';
import { TransactionMonitoringAlerts } from '@/pages/TransactionMonitoringAlerts/TransactionMonitoringAlerts.page';
import { TransactionMonitoring } from '@/pages/TransactionMonitoring/TransactionMonitoring';
import { TransactionMonitoringAlertsAnalysisPage } from '@/pages/TransactionMonitoringAlertsAnalysis/TransactionMonitoringAlertsAnalysis.page';
import { Welcome } from '../common/components/atoms/Welcome/Welcome';
import { Statistics } from '@/pages/Statistics/Statistics.page';
import { Workflows } from '@/pages/Workflows/Workflows.page';

const router = createBrowserRouter([
  {
    path: '/*',
    element: <NotFoundRedirect />,
    errorElement: <RouteError />,
  },
  {
    path: '/',
    element: <Root />,
    loader: rootLoader,
    errorElement: <RootError />,
    children: [
      {
        element: <UnauthenticatedLayout />,
        loader: unauthenticatedLayoutLoader,
        errorElement: <RouteError />,
        children: [
          {
            path: '/:locale',
            element: <Locale />,
            errorElement: <RouteError />,
            children: [
              ...(env.VITE_AUTH_ENABLED
                ? [
                    {
                      path: '/:locale/auth/sign-in',
                      element: <SignIn />,
                      errorElement: <RouteError />,
                    },
                  ]
                : []),
            ],
          },
        ],
      },
      {
        element: <AuthenticatedLayout />,
        loader: authenticatedLayoutLoader,
        errorElement: <RouteError />,
        children: [
          {
            path: '/:locale',
            element: <Locale />,
            errorElement: <RouteError />,
            children: [
              {
                path: '/:locale/case-management',
                element: <CaseManagement />,
                errorElement: <RouteError />,
                children: [
                  {
                    path: '/:locale/case-management/entities',
                    element: <Entities />,
                    loader: entitiesLoader,
                    errorElement: <RouteError />,
                    children: [
                      {
                        path: '/:locale/case-management/entities/:entityId',
                        element: <Entity />,
                        loader: entityLoader,
                        errorElement: <RouteError />,
                      },
                    ],
                  },
                ],
              },
              {
                path: '/:locale/transaction-monitoring',
                element: <TransactionMonitoring />,
                errorElement: <RouteError />,
                children: [
                  {
                    path: '/:locale/transaction-monitoring/alerts',
                    element: <TransactionMonitoringAlerts />,
                    errorElement: <RouteError />,
                    children: [
                      {
                        path: '/:locale/transaction-monitoring/alerts/:alertId',
                        element: <TransactionMonitoringAlertsAnalysisPage />,
                        errorElement: <RouteError />,
                      },
                    ],
                  },
                ],
              },
              {
                path: '/:locale',
                element: (
                  <div className={`flex flex-col p-4`}>
                    <Welcome />
                    <Outlet />
                  </div>
                ),
                children: [
                  {
                    path: '/:locale/statistics',
                    element: <Statistics />,
                    errorElement: <RouteError />,
                  },
                  {
                    path: '/:locale/workflows',
                    element: <Workflows />,
                    errorElement: <RouteError />,
                  },
                ],
                errorElement: <RouteError />,
              },
            ],
          },
        ],
      },
      {
        element: <Document />,
        loader: authenticatedLayoutLoader,
        errorElement: <RouteError />,
        path: '/:locale/case-management/entities/:entityId/document/:documentId',
      },
    ],
  },
]);

export const Router: FunctionComponent = () => {
  return <RouterProvider router={router} />;
};
