import { RouteError } from '@/common/components/atoms/RouteError/RouteError';
import { RouteErrorWithProviders } from '@/common/components/atoms/RouteError/RouteErrorWithProviders';
import { env } from '@/common/env/env';
import { queryClient } from '@/lib/react-query/query-client';
import { customerQueryKeys } from '@/domains/customer/query-keys';
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
import { KybAndOwnership } from '@/pages/KybAndOwnership/KybAndOwnership.page';
import { KybAndOwnershipAssessmentPage } from '@/pages/KybAndOwnershipAssessmentPage';
import { IdentityVerification } from '@/pages/IdentityVerification/IdentityVerification.page';
import { IdentityVerificationAssessmentPage } from '@/pages/IdentityVerificationAssessment/IdentityVerificationAssessment.page';

const router = createBrowserRouter(
  [
    {
      path: '/*',
      element: <NotFoundRedirectWithProviders />,
      handle: {
        middleware: rootLoader,
      },
      errorElement: <RouteErrorWithProviders />,
    },
    {
      path: '/',
      element: <Root />,
      handle: {
        middleware: rootLoader,
      },
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
                  loader: async () => {
                    await queryClient.ensureQueryData(customerQueryKeys.getCurrent());

                    return true;
                  },
                  errorElement: <RouteError />,
                  children: [
                    {
                      path: '/:locale/kyb-and-ownership',
                      element: <KybAndOwnership />,
                      errorElement: <RouteError />,
                    },
                    {
                      path: '/:locale/kyb-and-ownership/:assessmentId',
                      element: <KybAndOwnershipAssessmentPage />,
                      errorElement: <RouteError />,
                    },
                  ],
                },
                // {
                //   loader: async () => {
                //     await queryClient.ensureQueryData(customerQueryKeys.getCurrent());

                //     return true;
                //   },
                //   errorElement: <RouteError />,
                //   children: [
                //     {
                //       path: '/:locale/identity-verification',
                //       element: <IdentityVerification />,
                //       errorElement: <RouteError />,
                //     },
                //     {
                //       path: '/:locale/identity-verification/:checkId',
                //       element: <IdentityVerificationAssessmentPage />,
                //       errorElement: <RouteError />,
                //     },
                //   ],
                // },
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
  ],
  {
    // From RR Wiki: Two-phase "middlewares in sequence first, loaders in parallel next" strategy
    async dataStrategy({ request, params, matches }) {
      const context = {};

      for (const match of matches) {
        if (match.route.handle?.middleware) {
          await match.route.handle.middleware({ request, params }, context);
        }
      }

      // Run loaders in parallel with the `context` value
      const matchesToLoad = matches.filter(m => m.shouldLoad);
      const results = await Promise.all(
        matchesToLoad.map((match, i) =>
          match.resolve(handler => {
            // Whatever you pass to `handler` will be passed as the 2nd parameter
            // to your loader/action
            return handler(context);
          }),
        ),
      );

      console.assert(
        matchesToLoad.length === results.length,
        'result must match matches in length',
      );

      return results.reduce(
        (acc, result, i) =>
          Object.assign(acc, {
            // Length of matches and results is asserter above
            [matchesToLoad[i]!.route.id]: result,
          }),
        {},
      );
    },
  },
);

export const Router: FunctionComponent = () => {
  return <RouterProvider router={router} />;
};
