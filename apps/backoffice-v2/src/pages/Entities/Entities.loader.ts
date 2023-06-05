import { searchParamsToObject } from '../../common/hooks/useZodSearchParams/utils/search-params-to-object';
import { authQueryKeys } from '../../domains/auth/query-keys';
import { queryClient } from '../../lib/react-query/query-client';
import { usersQueryKeys } from '../../domains/users/query-keys';
import { LoaderFunction } from 'react-router-dom';
import { workflowsQueryKeys } from '../../domains/workflows/query-keys';

export const entitiesLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const { entity, filterId } = searchParamsToObject(url.searchParams);
  const authenticatedUser = authQueryKeys.authenticatedUser();
  const session = await queryClient.ensureQueryData(
    authenticatedUser.queryKey,
    authenticatedUser.queryFn,
  );

  if (!entity || !filterId || !session?.user) return null;

  const usersList = usersQueryKeys.list();
  await queryClient.ensureQueryData(usersList.queryKey, usersList.queryFn);
  const workflowList = workflowsQueryKeys.list(filterId);
  await queryClient.ensureQueryData(workflowList.queryKey, workflowList.queryFn);

  return null;
};
