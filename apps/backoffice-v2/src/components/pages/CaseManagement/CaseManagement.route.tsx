import { Outlet, Route } from '@tanstack/react-router';
import { rootRoute } from '@/components/pages/Root/Root.route';

export const caseManagementRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/$locale/case-management',
  component: Outlet,
});
