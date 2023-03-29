import { Outlet, Route } from '@tanstack/react-router';
import { caseManagementRoute } from '@/components/pages/CaseManagement/CaseManagement.route';

export const caseManagementIndexRoute = new Route({
  getParentRoute: () => caseManagementRoute,
  path: '/',
  component: Outlet,
});
