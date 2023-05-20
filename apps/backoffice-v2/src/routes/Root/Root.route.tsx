import { RootRoute } from '@tanstack/react-router';
import { queryClient } from '../../lib/react-query/query-client';
import { env } from '../../env/env';
import { Root } from './Root.page';
import { filters } from '../../lib/react-query/filters';
import { authQueryKeys } from '../../auth/query-keys';

// Layout and globals
export const rootRoute = new RootRoute({
  onLoad: async () => {
    if (!env.VITE_AUTH_ENABLED) return {};

    const authenticatedUser = authQueryKeys.authenticatedUser();
    const session = await queryClient.ensureQueryData(
      authenticatedUser.queryKey,
      authenticatedUser.queryFn,
    );

    if (!session?.user) return;

    const filtersList = filters.list();
    await queryClient.ensureQueryData(filtersList.queryKey, filtersList.queryFn);

    return {};
  },
  beforeLoad: ({ router }) => {
    if (router.history.location.pathname.startsWith('/en')) return;

    void router.navigate({
      to: '/$locale',
      replace: true,
      params: {
        locale: 'en',
      },
    });
  },
  component: Root,
});
