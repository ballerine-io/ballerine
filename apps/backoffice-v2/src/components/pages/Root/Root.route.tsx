import { RootRoute } from '@tanstack/react-router';
import { queryClient } from '../../../lib/react-query/query-client';
import { auth } from '../../../lib/react-query/auth';
import { env } from '../../../env/env';
import { Root } from 'components/pages/Root/Root.page';
import { filters } from '../../../lib/react-query/filters';

// Layout and globals
export const rootRoute = new RootRoute({
  onLoad: async () => {
    const filtersList = filters.list();
    await queryClient.ensureQueryData(filtersList.queryKey, filtersList.queryFn);

    if (!env.VITE_AUTH_ENABLED) return {};

    const getSession = auth.getSession();
    const data = queryClient.getQueryData(getSession.queryKey);

    if (data) return {};

    await queryClient.prefetchQuery(getSession.queryKey, getSession.queryFn);

    return {};
  },
  beforeLoad: ({ router }) => {
    if (router.history.location.pathname.startsWith('/en')) return;

    router.navigate({
      to: '/$locale',
      replace: true,
      params: {
        locale: 'en',
      },
    });
  },
  component: Root,
});
