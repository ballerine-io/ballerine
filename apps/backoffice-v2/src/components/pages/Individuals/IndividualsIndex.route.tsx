import { individualsRoute } from '@/components/pages/Individuals/Individuals.route';
import { Route } from '@tanstack/react-router';

export const individualsIndexRoute = new Route({
  getParentRoute: () => individualsRoute,
  path: '/',
});
