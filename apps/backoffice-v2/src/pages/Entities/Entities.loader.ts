import { authQueryKeys } from '../../domains/auth/query-keys';
import { queryClient } from '../../lib/react-query/query-client';
import { usersQueryKeys } from '../../domains/users/query-keys';
import { LoaderFunction } from 'react-router-dom';
import { workflowsQueryKeys } from '../../domains/workflows/query-keys';
import { defaultDeserializer } from '../../common/hooks/useZodSearchParams/utils/default-deserializer';

export const entitiesLoader: LoaderFunction = async ({ request }) => {
  const { entity, filterId, filter, sortBy, sortDir, page, pageSize } = defaultDeserializer(
    request.url.split('?')[1],
  );
  const authenticatedUser = authQueryKeys.authenticatedUser();
  const session = await queryClient.ensureQueryData(
    authenticatedUser.queryKey,
    authenticatedUser.queryFn,
  );

  if (!entity || !filterId || !session?.user || !sortBy || !sortDir || !page || !pageSize) {
    return null;
  }

  const usersList = usersQueryKeys.list();
  await queryClient.ensureQueryData(usersList.queryKey, usersList.queryFn);
  const workflowList = workflowsQueryKeys.list({
    filterId,
    filter,
    sortBy,
    sortDir,
    page,
    pageSize,
  });
  await queryClient.ensureQueryData(workflowList.queryKey, workflowList.queryFn);

  return null;
};
