import { Outlet, Route } from '@tanstack/react-router';
import { caseManagementRoute } from 'components/pages/CaseManagement/CaseManagement.route';

export const businessesRoute = new Route({
  getParentRoute: () => caseManagementRoute,
  path: 'businesses',
  component: Outlet,
});
