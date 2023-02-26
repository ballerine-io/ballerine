import { Route } from '@tanstack/react-router';
import { rootRoute } from 'components/pages/Root/Root.route';

export const rootLayout = new Route({
  getParentRoute: () => rootRoute,
  id: 'root-layout',
});
