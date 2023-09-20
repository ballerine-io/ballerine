import { LoaderFunction, redirect } from 'react-router-dom';

export const rootLoader: LoaderFunction = ({ request }) => {
  const url = new URL(request.url);

  if (url.pathname.startsWith('/en')) return null;

  return redirect(`/en${url.pathname === '/' ? '' : url.pathname}${url.search}`);
};
