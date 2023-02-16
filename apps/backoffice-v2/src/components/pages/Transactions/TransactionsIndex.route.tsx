import { Route } from '@tanstack/react-router';
import { transactionsRoute } from 'components/pages/Transactions/Transactions.route';
import { ComingSoonPage } from 'components/templates/ComingSoonPage/ComingSoonPage';

export const transactionsIndexRoute = new Route({
  getParentRoute: () => transactionsRoute,
  path: '/',
  component: ComingSoonPage,
});
