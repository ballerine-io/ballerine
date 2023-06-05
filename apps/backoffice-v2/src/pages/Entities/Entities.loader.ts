import { searchParamsToObject } from '../../common/hooks/useZodSearchParams/utils/search-params-to-object';
import { authQueryKeys } from '../../domains/auth/query-keys';
import { queryClient } from '../../lib/react-query/query-client';
import { queryKeys } from '../../domains/entities/query-keys';
import { usersQueryKeys } from '../../domains/users/query-keys';
import { LoaderFunction } from 'react-router-dom';

export const entitiesLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const { entity, filterId } = searchParamsToObject(url.searchParams);
  const authenticatedUser = authQueryKeys.authenticatedUser();
  const session = await queryClient.ensureQueryData(
    authenticatedUser.queryKey,
    authenticatedUser.queryFn,
  );

  if (!entity || !filterId || !session?.user) return null;

  const entityList = queryKeys[entity].list?.(filterId);
  const usersList = usersQueryKeys.list();
  await queryClient.ensureQueryData(entityList.queryKey, entityList.queryFn);
  await queryClient.ensureQueryData(usersList.queryKey, usersList.queryFn);

  return null;
};
