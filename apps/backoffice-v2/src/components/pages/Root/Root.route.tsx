import { RootRoute } from '@tanstack/react-router';
import { queryClient } from '../../../lib/react-query/query-client';
import { auth } from '../../../lib/react-query/auth';
import { env } from '../../../env/env';
import { Root } from 'components/pages/Root/Root.page';
import { filters } from '../../../lib/react-query/filters'; // Layout and globals
import { RootError } from 'components/pages/Root/Root.error';

// Layout and globals
export const rootRoute = new RootRoute({
  onLoad: async () => {
    if (!env.VITE_AUTH_ENABLED) return {};

    const getSession = auth.getSession();
    const session = await queryClient.ensureQueryData(getSession.queryKey, getSession.queryFn);

    if (!session?.user) return;

    const filtersList = filters.list();
    await queryClient.ensureQueryData(filtersList.queryKey, filtersList.queryFn);

    return {};
  },
  beforeLoad: ({ router }) => {
    const pathname = router.state.latestLocation.pathname;

    if (pathname.startsWith('/en')) return;

    router.navigate({
      to: `/$locale${pathname}`,
      replace: true,
      params: params => ({
        ...params,
        locale: 'en',
      }),
    });
  },
  component: Root,
  errorComponent: RootError,
});
