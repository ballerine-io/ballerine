import { Outlet, Route } from '@tanstack/react-router';
import {rootRoute} from "components/pages/Root/Root.route";
import {VersionPage} from "components/pages/Version/Version.page";

export const versionRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/version',
  component: VersionPage,
});
