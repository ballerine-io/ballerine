import { env } from '../../common/env/env';
import { authQueryKeys } from '../../domains/auth/query-keys';
import { queryClient } from '../../lib/react-query/query-client';
import { filtersQueryKeys } from '../../domains/filters/query-keys';
import { LoaderFunction } from 'react-router-dom';

export const localeLoader: LoaderFunction = async () => {
  if (!env.VITE_AUTH_ENABLED) return null;

  const authenticatedUser = authQueryKeys.authenticatedUser();
  const session = await queryClient.ensureQueryData(
    authenticatedUser.queryKey,
    authenticatedUser.queryFn,
  );

  if (!session?.user) return null;

  const filtersList = filtersQueryKeys.list();
  await queryClient.ensureQueryData(filtersList.queryKey, filtersList.queryFn);

  return null;
};
