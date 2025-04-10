import { queryClient } from '../../lib/react-query/query-client';
import { LoaderFunction } from 'react-router-dom';
import { workflowsQueryKeys } from '../../domains/workflows/query-keys';
import { authQueryKeys } from '../../domains/auth/query-keys';

export const entityLoader: LoaderFunction = async ({ params }) => {
  const authenticatedUser = authQueryKeys.authenticatedUser();
  const session = await queryClient.ensureQueryData(
    authenticatedUser.queryKey,
    authenticatedUser.queryFn,
  );

  if (!session?.user) {
    return null;
  }

  const workflowById = workflowsQueryKeys.byId({ workflowId: params.entityId });
  await queryClient.ensureQueryData(workflowById.queryKey, workflowById.queryFn);

  return null;
};
