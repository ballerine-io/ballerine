import { Route } from '@tanstack/react-router';
import { companiesRoute } from '@/components/pages/Companies/Companies.route';
import { ComingSoonPage } from '@/components/templates/ComingSoonPage/ComingSoonPage';

export const companiesIndexRoute = new Route({
  getParentRoute: () => companiesRoute,
  path: '/',
  component: ComingSoonPage,
});
