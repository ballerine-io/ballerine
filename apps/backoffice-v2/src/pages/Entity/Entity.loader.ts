import { searchParamsToObject } from '../../common/hooks/useZodSearchParams/utils/search-params-to-object';
import { queryClient } from '../../lib/react-query/query-client';
import { LoaderFunction } from 'react-router-dom';
import { workflowsQueryKeys } from '../../domains/workflows/query-keys';
import { authQueryKeys } from '../../domains/auth/query-keys';

export const entityLoader: LoaderFunction = async ({ request, params }) => {
  const url = new URL(request.url);
  const { filterId } = searchParamsToObject(url.searchParams);
  const authenticatedUser = authQueryKeys.authenticatedUser();
  const session = await queryClient.ensureQueryData(
    authenticatedUser.queryKey,
    authenticatedUser.queryFn,
  );

  if (!filterId || !session?.user) {
    return null;
  }

  const workflowById = workflowsQueryKeys.byId({ workflowId: params.entityId, filterId });
  await queryClient.ensureQueryData(workflowById.queryKey, workflowById.queryFn);

  return null;
};
