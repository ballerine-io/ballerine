import { LoaderFunction, redirect } from 'react-router-dom';
import { env } from '@/common/env/env';
import { queryClient } from '@/lib/react-query/query-client';
import { magicLinkSignIn } from '@/domains/auth/fetchers';
import { authQueryKeys } from '../../query-keys';
import { filtersQueryKeys } from '../../../filters/query-keys';

export const authenticatedLayoutLoader: LoaderFunction = async ({ request }) => {
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
