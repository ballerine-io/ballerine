import React, { FunctionComponent } from 'react';
import { env } from '../common/env/env';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { RootError } from '../pages/Root/Root.error';
import { Root } from '../pages/Root/Root.page';
import { SignIn } from '../pages/SignIn/SignIn.page';
import { Entity } from '../pages/Entity/Entity.page';
import { Entities } from '../pages/Entities/Entities.page';
import { RouteError } from '../common/components/atoms/RouteError/RouteError';
import { CaseManagement } from '../pages/CaseManagement/CaseManagement.page';
import { rootLoader } from '../pages/Root/Root.loader';
import { entitiesLoader } from '../pages/Entities/Entities.loader';
import { localeLoader } from '../pages/Locale/Locale.loader';
import { Locale } from '../pages/Locale/Locale.page';
import { entityLoader } from '../pages/Entity/Entity.loader';

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
                    loader: entityLoader,
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
