import { App } from '@app/App';
import { DashboardLayout } from '@app/components/layouts/DashboardLayout';
import { Workflows } from '@app/pages/Workflows';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '',
        Component: DashboardLayout,
        children: [
          {
            path: 'workflows',
            Component: Workflows,
          },
        ],
      },
    ],
  },
]);
