import { entitiesRoute } from './Entities.route';
import { Route } from '@tanstack/react-router';

export const entitiesIndexRoute = new Route({
  getParentRoute: () => entitiesRoute,
  path: '/',
});
