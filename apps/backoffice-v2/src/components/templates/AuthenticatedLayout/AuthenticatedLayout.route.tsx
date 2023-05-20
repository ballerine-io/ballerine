import { Route } from '@tanstack/react-router';
import { AuthenticatedLayout } from 'components/templates/AuthenticatedLayout/AuthenticatedLayout.layout';
import { rootLayout } from '../../../routes/Root/Root.layout';

export const authenticatedLayout = new Route({
  getParentRoute: () => rootLayout,
  id: 'authenticated-layout',
  component: AuthenticatedLayout,
});
