import { individualsRoute } from './Individuals.route';
import { Route } from '@tanstack/react-router';

export const individualsIndexRoute = new Route({
  getParentRoute: () => individualsRoute,
  path: '/',
});
