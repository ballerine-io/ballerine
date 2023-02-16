import { Route } from '@tanstack/react-router';
import { SignIn } from 'components/pages/SignIn/SignIn.page';
import { rootRoute } from 'components/pages/Root/Root.route';

export const signInRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/$locale/auth/sign-in',
  component: SignIn,
});
