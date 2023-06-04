import { RootRoute } from '@tanstack/react-router';
import { queryClient } from '../../lib/react-query/query-client';
import { env } from '../../common/env/env';
import { Root } from './Root.page';
import { authQueryKeys } from '../../domains/auth/query-keys';
import { filtersQueryKeys } from '../../domains/filters/query-keys';
import { RootError } from './Root.error';

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

    const filtersList = filtersQueryKeys.list();
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
