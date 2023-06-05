import { Route } from '@tanstack/react-router';
import { queryClient } from '../../lib/react-query/query-client';
import { entitiesRoute } from '../Entities/Entities.route';
import { Entity } from './Entity.page';
import { queryKeys } from '../../domains/entities/query-keys';
import { authQueryKeys } from '../../domains/auth/query-keys';
import { Alert } from '../../common/components/atoms/Alert/Alert';
import { AlertTitle } from '../../common/components/atoms/Alert/Alert.Title';
import { AlertDescription } from '../../common/components/atoms/Alert/Alert.Description';
import { AlertCircle } from 'lucide-react';

// @ts-ignore
export const entityRoute = new Route({
  getParentRoute: () => entitiesRoute,
  path: '$entityId',
  onLoad: async ({ params, search }) => {
    const { entityId } = params;
    const entityById = queryKeys[search?.entity].byId(entityId, search?.filterId);
    const authenticatedUser = authQueryKeys.authenticatedUser();
    const session = queryClient.getQueryData<Awaited<ReturnType<typeof authenticatedUser.queryFn>>>(
      authenticatedUser.queryKey,
    );

    if (!session?.user) return;
    // TODO: Add workflowId to params/searchParams
    // const workflowById = workflows.byId({ workflowId });

    if (search?.filterId) {
      await queryClient.ensureQueryData(entityById.queryKey, entityById.queryFn);
    }

    // await queryClient.ensureQueryData(workflowById.queryKey, workflowById.queryFn);

    return {};
  },
  component: Entity,
  errorComponent: ({ error }) => (
    <div className={`mt-3 p-1`}>
      <Alert variant={`destructive`} className={`w-full max-w-lg`}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    </div>
  ),
});
