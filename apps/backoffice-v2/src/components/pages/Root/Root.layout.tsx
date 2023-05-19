import { Route } from '@tanstack/react-router';
import { rootRoute } from './Root.route';

export const rootLayout = new Route({
  getParentRoute: () => rootRoute,
  id: 'root-layout',
});
