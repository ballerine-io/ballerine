import { RouteError } from '@/common/components/atoms/RouteError/RouteError';
import { env } from '@/common/env/env';
import { AuthenticatedLayout } from '@/domains/auth/components/AuthenticatedLayout';
import { authenticatedLayoutLoader } from '@/domains/auth/components/AuthenticatedLayout/AuthenticatedLayout.loader';
import { UnauthenticatedLayout } from '@/domains/auth/components/UnauthenticatedLayout';
import { unauthenticatedLayoutLoader } from '@/domains/auth/components/UnauthenticatedLayout/UnauthenticatedLayout.loader';
import { Businesses } from '@/pages/Businesses/Businesses';
import { BusinessesAlerts } from '@/pages/BusinessesAlerts/BusinessesAlerts.page';
import { BusinessesAlertsAnalysisPage } from '@/pages/BusinessesAlertsAnalysis/BusinessesAlertsAnalysis.page';
import { CaseManagement } from '@/pages/CaseManagement/CaseManagement.page';
import { Document } from '@/pages/Document/Document.page';
import { entitiesLoader } from '@/pages/Entities/Entities.loader';
import { Entities } from '@/pages/Entities/Entities.page';
import { entityLoader } from '@/pages/Entity/Entity.loader';
import { Entity } from '@/pages/Entity/Entity.page';
import { Locale } from '@/pages/Locale/Locale.page';
import { NotFoundRedirect } from '@/pages/NotFound/NotFound';
import { OngoingMonitoring } from '@/pages/OngoingMonitoring/OngoingMonitoring';
import { OngoingMonitoringAlertsPage } from '@/pages/OngoingMonitoringAlerts/OngoingMonitoringAlerts.page';
import { RootError } from '@/pages/Root/Root.error';
import { rootLoader } from '@/pages/Root/Root.loader';
import { Root } from '@/pages/Root/Root.page';
import { SignIn } from '@/pages/SignIn/SignIn.page';
import { TransactionMonitoring } from '@/pages/TransactionMonitoring/TransactionMonitoring';
import { TransactionMonitoringAlerts } from '@/pages/TransactionMonitoringAlerts/TransactionMonitoringAlerts.page';
import { FunctionComponent } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';

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
                        element: <TransactionMonitoringAlerts />,
                        errorElement: <RouteError />,
                      },
                    ],
                  },
                ],
              },
              {
                path: '/:locale/businesses',
                element: <Businesses />,
                errorElement: <RouteError />,
                children: [
                  {
                    path: '/:locale/businesses/alerts',
                    element: <BusinessesAlerts />,
                    errorElement: <RouteError />,
                    children: [
                      {
                        path: '/:locale/businesses/alerts/:alertId',
                        element: <BusinessesAlertsAnalysisPage />,
                        errorElement: <RouteError />,
                      },
                    ],
                  },
                ],
              },
              {
                path: '/:locale/ongoing-monitoring',
                element: <OngoingMonitoring />,
                errorElement: <RouteError />,
                children: [
                  {
                    path: '/:locale/ongoing-monitoring/alerts',
                    element: <OngoingMonitoringAlertsPage />,
                    errorElement: <RouteError />,
                  },
                ],
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
