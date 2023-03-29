import { Route } from '@tanstack/react-router';
import { endUsers } from '@/lib/react-query/end-users';
import { queryClient } from '@/lib/react-query/query-client';
import { individualsRoute } from '@/components/pages/Individuals/Individuals.route';
import { Individual } from '@/components/pages/Individual/Individual.page';

// @ts-ignore
export const individualRoute = new Route({
  getParentRoute: () => individualsRoute,
  path: '$endUserId',
  onLoad: async ({ params }) => {
    const { endUserId } = params;
    const endUserById = endUsers.byId(endUserId);
    // TODO: Add workflowId to params/searchParams
    // const workflowById = workflows.byId({ workflowId });

    if (!queryClient.getQueryData(endUserById.queryKey)) {
      await queryClient.prefetchQuery(endUserById.queryKey, endUserById.queryFn);
    }

    // if (!queryClient.getQueryData(workflowById.queryKey)) {
    //   await queryClient.prefetchQuery(workflowById.queryKey, workflowById.queryFn);
    // }

    return {};
  },
  component: Individual,
});
