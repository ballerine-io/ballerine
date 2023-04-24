import { Route } from '@tanstack/react-router';
import { queryClient } from '../../../lib/react-query/query-client';
import { individualsRoute } from 'components/pages/Individuals/Individuals.route';
import { Individual } from 'components/pages/Individual/Individual.page';
import { queries } from '../../../lib/react-query/queries';

// @ts-ignore
export const individualRoute = new Route({
  getParentRoute: () => individualsRoute,
  path: '$endUserId',
  onLoad: async ({ params, search }) => {
    const { endUserId } = params;
    const entityById = queries[search?.kind].byId(endUserId);
    // TODO: Add workflowId to params/searchParams
    // const workflowById = workflows.byId({ workflowId });

    await queryClient.ensureQueryData(entityById.queryKey, entityById.queryFn);

    // await queryClient.ensureQueryData(workflowById.queryKey, workflowById.queryFn);

    return {};
  },
  component: Individual,
});
