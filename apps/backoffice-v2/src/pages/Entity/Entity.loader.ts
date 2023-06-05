import { authQueryKeys } from '../../domains/auth/query-keys';
import { queryClient } from '../../lib/react-query/query-client';
import { queryKeys } from '../../domains/entities/query-keys';
import { LoaderFunction } from 'react-router-dom';

export const entityLoader: LoaderFunction = async ({ params, request }) => {
  const url = new URL(request.url);
  const { entityId } = params;
  const entity = url?.searchParams?.get('entity');
  const filterId = url?.searchParams?.get('filterId');
  const authenticatedUser = authQueryKeys.authenticatedUser();
  const session = await queryClient.ensureQueryData(
    authenticatedUser.queryKey,
    authenticatedUser.queryFn,
  );

  if (entity || !filterId || !session?.user) return null;

  const entityById = queryKeys[entity].byId(entityId, filterId);
  // TODO: Add workflowId to params/searchParams
  // const workflowById = workflows.byId({ workflowId });

  await queryClient.ensureQueryData(entityById.queryKey, entityById.queryFn);

  // await queryClient.ensureQueryData(workflowById.queryKey, workflowById.queryFn);

  return null;
};
