import { Route } from '@tanstack/react-router';
import { SignIn } from './SignIn.page';
import { rootRoute } from '../Root/Root.route';

export const signInRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/$locale/auth/sign-in',
  component: SignIn,
});
