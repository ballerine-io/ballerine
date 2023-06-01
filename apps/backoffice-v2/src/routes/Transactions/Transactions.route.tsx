import { Outlet, Route } from '@tanstack/react-router';
import { caseManagementRoute } from '../CaseManagement/CaseManagement.route';

export const transactionsRoute = new Route({
  getParentRoute: () => caseManagementRoute,
  path: 'transactions',
  component: Outlet,
});
