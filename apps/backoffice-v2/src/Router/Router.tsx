import React, { FunctionComponent } from 'react';
import { env } from '../common/env/env';
import { createBrowserRouter, Outlet, redirect, RouterProvider } from 'react-router-dom';
import { RootError } from '../routes/Root/Root.error';
import { Root } from '../routes/Root/Root.page';
import { SignIn } from '../routes/SignIn/SignIn.page';
import { authQueryKeys } from '../domains/auth/query-keys';
import { queryClient } from '../lib/react-query/query-client';
import { filtersQueryKeys } from '../domains/filters/query-keys';
import { Entity } from '../routes/Entity/Entity.page';
import { Entities } from '../routes/Entities/Entities.page';
import { queryKeys } from '../domains/entities/query-keys';
import { usersQueryKeys } from '../domains/users/query-keys';
import { searchParamsToObject } from '../common/hooks/useZodSearchParams/utils/search-params-to-object';
import { RouteError } from '../common/components/atoms/RouteError/RouteError';
import { CaseManagement } from '../routes/CaseManagement/CaseManagement.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    loader({ request }) {
      const url = new URL(request.url);

      if (url.pathname.startsWith('/en')) return null;

      return redirect(`/en${url.pathname === '/' ? '' : url.pathname}`);
    },
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
        element: <Outlet />,
        async loader() {
          if (!env.VITE_AUTH_ENABLED) return null;

          const authenticatedUser = authQueryKeys.authenticatedUser();
          const session = await queryClient.ensureQueryData(
            authenticatedUser.queryKey,
            authenticatedUser.queryFn,
          );

          if (!session?.user) return null;

          const filtersList = filtersQueryKeys.list();
          await queryClient.ensureQueryData(filtersList.queryKey, filtersList.queryFn);

          return null;
        },
        errorElement: <RouteError />,
        children: [
          {
            path: '/:locale/case-management',
            element: <CaseManagement />,
            children: [
              {
                path: '/:locale/case-management/entities',
                element: <Entities />,
                async loader({ request }) {
                  const url = new URL(request.url);
                  const { entity, filterId } = searchParamsToObject(url.searchParams);

                  if (!entity || !filterId) return null;

                  const entityList = queryKeys[entity].list?.(filterId);
                  const usersList = usersQueryKeys.list();
                  await queryClient.ensureQueryData(entityList.queryKey, entityList.queryFn);
                  await queryClient.ensureQueryData(usersList.queryKey, usersList.queryFn);

                  return null;
                },
                errorElement: <RouteError />,
                children: [
                  {
                    path: '/:locale/case-management/entities/:entityId',
                    element: <Entity />,
                    async loader({ params, request }) {
                      const url = new URL(request.url);
                      const { entityId } = params;
                      const entity = url?.searchParams?.get('entity');
                      const filterId = url?.searchParams?.get('filterId');

                      if (entity || !filterId) return null;

                      const entityById = queryKeys[entity].byId(entityId, filterId);
                      // TODO: Add workflowId to params/searchParams
                      // const workflowById = workflows.byId({ workflowId });

                      await queryClient.ensureQueryData(entityById.queryKey, entityById.queryFn);

                      // await queryClient.ensureQueryData(workflowById.queryKey, workflowById.queryFn);

                      return null;
                    },
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
