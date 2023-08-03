import { LoaderFunction, redirect } from 'react-router-dom';

export const unauthenticatedLayoutLoader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  if (url.pathname === `/en/auth/sign-in`) return null;

  return redirect(`/en/auth/sign-in`);
};
