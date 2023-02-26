import { Outlet, Route } from '@tanstack/react-router';
import { caseManagementRoute } from 'components/pages/CaseManagement/CaseManagement.route';

export const companiesRoute = new Route({
  getParentRoute: () => caseManagementRoute,
  path: 'companies',
  component: Outlet,
});
