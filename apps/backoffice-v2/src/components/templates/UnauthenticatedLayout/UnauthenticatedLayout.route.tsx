import { Route } from '@tanstack/react-router';
import { UnauthenticatedLayout } from 'components/templates/UnauthenticatedLayout/UnauthenticatedLayout.layout';
import { rootLayout } from '../../../routes/Root/Root.layout';

export const unauthenticatedLayout = new Route({
  getParentRoute: () => rootLayout,
  id: 'unauthenticated-layout',
  component: UnauthenticatedLayout,
});
