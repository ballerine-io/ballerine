import { LoaderFunction, redirect } from 'react-router-dom';
import { queryClient } from '@/lib/react-query/query-client';
import { magicLinkSignIn } from '@/domains/auth/fetchers';

export const rootLoader: LoaderFunction = async ({ request }) => {
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

  if (url.pathname.startsWith('/en') && !token) return null;

  const newUrl = new URL(request.url);

  if (token) {
    newUrl.searchParams.delete('token');
  }

  if (!newUrl.pathname.startsWith('/en')) {
    newUrl.pathname = `/en${url.pathname === '/' ? '' : url.pathname}`;
  }

  return redirect(newUrl.toString());
};
