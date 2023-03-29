import { Route } from '@tanstack/react-router';
import { rootRoute } from '@/components/pages/Root/Root.route';

export const rootIndexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
});
