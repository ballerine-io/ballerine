import { Route } from '@tanstack/react-router';
import { queryClient } from '../../../lib/react-query/query-client';
import { individualsRoute } from '../Individuals/Individuals.route';
import { Individual } from './Individual.page';
import { queryKeys } from '../../../lib/react-query/query-keys';

// @ts-ignore
export const individualRoute = new Route({
  getParentRoute: () => individualsRoute,
  path: '$entityId',
  onLoad: async ({ params, search }) => {
    const { entityId } = params;
    const entityById = queryKeys[search?.entity].byId(entityId, search?.filterId);
    // TODO: Add workflowId to params/searchParams
    // const workflowById = workflows.byId({ workflowId });

    await queryClient.ensureQueryData(entityById.queryKey, entityById.queryFn);

    // await queryClient.ensureQueryData(workflowById.queryKey, workflowById.queryFn);

    return {};
  },
  component: Individual,
});
