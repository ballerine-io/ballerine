import { Route } from '@tanstack/react-router';
import { transactionsRoute } from './Transactions.route';
import { ComingSoonPage } from '../../common/components/templates/ComingSoonPage/ComingSoonPage';

export const transactionsIndexRoute = new Route({
  getParentRoute: () => transactionsRoute,
  path: '/',
  component: ComingSoonPage,
});
