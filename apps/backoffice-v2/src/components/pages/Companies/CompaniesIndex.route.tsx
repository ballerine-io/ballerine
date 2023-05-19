import { Route } from '@tanstack/react-router';
import { businessesRoute } from '../Businesses/Businesses.route';
import { ComingSoonPage } from 'components/templates/ComingSoonPage/ComingSoonPage';

export const businessesIndexRoute = new Route({
  getParentRoute: () => businessesRoute,
  path: '/',
  component: ComingSoonPage,
});
