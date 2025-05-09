import { RouteError } from '@/common/components/atoms/RouteError/RouteError';
import { RouteErrorWithProviders } from '@/common/components/atoms/RouteError/RouteErrorWithProviders';
import { env } from '@/common/env/env';
import { AuthenticatedLayout } from '@/domains/auth/components/AuthenticatedLayout';
import { authenticatedLayoutLoader } from '@/domains/auth/components/AuthenticatedLayout/AuthenticatedLayout.loader';
import { UnauthenticatedLayout } from '@/domains/auth/components/UnauthenticatedLayout';
import { unauthenticatedLayoutLoader } from '@/domains/auth/components/UnauthenticatedLayout/UnauthenticatedLayout.loader';
import { MerchantMonitoringLayout } from '@/domains/business-reports/components/MerchantMonitoringLayout/MerchantMonitoringLayout';
import { CaseManagement } from '@/pages/CaseManagement/CaseManagement.page';
import { Document } from '@/pages/Document/Document.page';
import { entitiesLoader } from '@/pages/Entities/Entities.loader';
import { Entities } from '@/pages/Entities/Entities.page';
import { entityLoader } from '@/pages/Entity/Entity.loader';
import { Entity } from '@/pages/Entity/Entity.page';
import { Home } from '@/pages/Home/Home.page';
import { Locale } from '@/pages/Locale/Locale.page';
import { MerchantMonitoring } from '@/pages/MerchantMonitoring/MerchantMonitoring.page';
import { MerchantMonitoringBusinessReport } from '@/pages/MerchantMonitoringBusinessReport/MerchantMonitoringBusinessReport.page';
import { MerchantMonitoringCreateCheckPage } from '@/pages/MerchantMonitoringCreateCheck/MerchantMonitoringCreateCheck.page';
import { MerchantMonitoringUploadMultiplePage } from '@/pages/MerchantMonitoringUploadMultiple/MerchantMonitoringUploadMultiple.page';
import { NotFoundRedirectWithProviders } from '@/pages/NotFound/NotFoundRedirectWithProviders';
import { RootError } from '@/pages/Root/Root.error';
import { rootLoader } from '@/pages/Root/Root.loader';
import { Root } from '@/pages/Root/Root.page';
import { SignIn } from '@/pages/SignIn/SignIn.page';
import { TransactionMonitoring } from '@/pages/TransactionMonitoring/TransactionMonitoring';
import { TransactionMonitoringAlerts } from '@/pages/TransactionMonitoringAlerts/TransactionMonitoringAlerts.page';
import { TransactionMonitoringAlertsAnalysisPage } from '@/pages/TransactionMonitoringAlertsAnalysis/TransactionMonitoringAlertsAnalysis.page';
import type { FunctionComponent } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/*',
    element: <NotFoundRedirectWithProviders />,
    loader: rootLoader,
    errorElement: <RouteErrorWithProviders />,
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
                element: <MerchantMonitoringLayout />,
                errorElement: <RouteError />,
                children: [
                  {
                    path: '/:locale/merchant-monitoring',
                    element: <MerchantMonitoring />,
                    errorElement: <RouteError />,
                  },
                  {
                    path: '/:locale/merchant-monitoring/:businessReportId',
                    element: <MerchantMonitoringBusinessReport />,
                    errorElement: <RouteError />,
                  },
                  {
                    path: '/:locale/merchant-monitoring/create-check',
                    element: <MerchantMonitoringCreateCheckPage />,
                    errorElement: <RouteError />,
                  },
                  {
                    path: '/:locale/merchant-monitoring/upload-multiple-merchants',
                    element: <MerchantMonitoringUploadMultiplePage />,
                    errorElement: <RouteError />,
                  },
                ],
              },
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
              // {
              //   path: '/:locale/profiles',
              //   element: <Profiles />,
              //   errorElement: <RouteError />,
              //   children: [
              //     {
              //       path: '/:locale/profiles/individuals',
              //       element: <Individuals />,
              //       errorElement: <RouteError />,
              //     },
              //   ],
              // },
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
                path: '/:locale/home',
                element: <Home />,
                errorElement: <RouteError />,
              },
            ],
          },
        ],
      },
      {
        element: <Document wrapperClassName="justify-center max-w-[600px]" />,
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
