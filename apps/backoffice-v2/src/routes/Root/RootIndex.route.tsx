import { Route } from '@tanstack/react-router';
import { rootRoute } from './Root.route';

export const rootIndexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
});
