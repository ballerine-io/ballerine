import { Route } from '@tanstack/react-router';
import { endUsers } from '../../../lib/react-query/end-users';
import { queryClient } from '../../../lib/react-query/query-client';
import { individualsRoute } from 'components/pages/Individuals/Individuals.route';
import { Individual } from 'components/pages/Individual/Individual.page';

// @ts-ignore
export const individualRoute = new Route({
  getParentRoute: () => individualsRoute,
  path: '$endUserId',
  onLoad: async ({ params }) => {
    const { endUserId } = params;
    const endUserById = endUsers.byId(endUserId);
    const data = queryClient.getQueryData(endUserById.queryKey);

    if (data) return {};

    await queryClient.prefetchQuery(endUserById.queryKey, endUserById.queryFn);

    return {};
  },
  component: Individual,
});
