import React, { FunctionComponent } from 'react';
import { env } from '../common/env/env';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootError } from '../routes/Root/Root.error';
import { Root } from '../routes/Root/Root.page';
import { SignIn } from '../routes/SignIn/SignIn.page';
import { Entity } from '../routes/Entity/Entity.page';
import { Entities } from '../routes/Entities/Entities.page';
import { RouteError } from '../common/components/atoms/RouteError/RouteError';
import { CaseManagement } from '../routes/CaseManagement/CaseManagement.page';
import { rootLoader } from '../routes/Root/Root.loader';
import { entitiesLoader } from '../routes/Entities/Entities.loader';
import { localeLoader } from '../routes/Locale/Locale.loader';
import { Locale } from '../routes/Locale/Locale.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    loader: rootLoader,
    errorElement: <RootError />,
    children: [
      ...(env.VITE_AUTH_ENABLED
        ? [
            {
              path: '/:locale/auth/sign-in',
              element: <SignIn />,
            },
          ]
        : []),
      {
        path: '/:locale',
        element: <Locale />,
        loader: localeLoader,
        errorElement: <RouteError />,
        children: [
          {
            path: '/:locale/case-management',
            element: <CaseManagement />,
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
                    errorElement: <RouteError />,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

export const Router: FunctionComponent = () => {
  return <RouterProvider router={router} />;
};
