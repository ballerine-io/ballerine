import { App } from '@app/App';
import { Overview } from '@app/pages/Overview';
import { Workflows } from '@app/pages/Workflows';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '',
        element: <Navigate to="/overview" replace />,
      },
      {
        path: 'overview',
        Component: Overview,
      },
      {
        path: 'workflows',
        Component: Workflows,
      },
    ],
  },
]);
