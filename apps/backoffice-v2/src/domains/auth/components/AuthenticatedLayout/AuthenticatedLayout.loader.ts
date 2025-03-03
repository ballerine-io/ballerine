import { LoaderFunction, redirect } from 'react-router-dom';
import { env } from '@/common/env/env';
import { queryClient } from '@/lib/react-query/query-client';
import { magicLinkSignIn } from '@/domains/auth/fetchers';
import { authQueryKeys } from '../../query-keys';
import { filtersQueryKeys } from '../../../filters/query-keys';

export const authenticatedLayoutLoader: LoaderFunction = async ({ request }) => {
  if (!env.VITE_AUTH_ENABLED) return null;

  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (token) {
    try {
      await queryClient.fetchQuery(['magic-link-auth', token], ({ queryKey }) =>
        magicLinkSignIn({ token: queryKey[1]! }),
      );
    } catch (e) {
      console.error('Error using magic link', e);
      return redirect(`/en/auth/sign-in`);
    }
  }

  const authenticatedUser = authQueryKeys.authenticatedUser();
  const session = await queryClient.ensureQueryData(
    authenticatedUser.queryKey,
    authenticatedUser.queryFn,
  );

  if (!session?.user) return null;

  const filtersList = filtersQueryKeys.list();
  await queryClient.ensureQueryData(filtersList.queryKey, filtersList.queryFn);

  if (token) {
    const newUrl = new URL(request.url);
    newUrl.searchParams.delete('token');
    return redirect(newUrl.toString());
  }

  return null;
};
