import { Route } from '@tanstack/react-router';
import { queryClient } from '../../lib/react-query/query-client';
import { entitiesRoute } from '../Entities/Entities.route';
import { Entity } from './Entity.page';
import { queryKeys } from '../../entities/query-keys';

// @ts-ignore
export const entityRoute = new Route({
  getParentRoute: () => entitiesRoute,
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
  component: Entity,
});
