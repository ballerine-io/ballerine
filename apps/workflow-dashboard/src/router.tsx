import { App } from '@app/App';
import { DashboardLayout } from '@app/components/layouts/DashboardLayout';
import { WorkflowsRuntime } from '@app/pages/WorkflowsRuntime';
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
            path: 'workflow-runtimes',
            Component: WorkflowsRuntime,
          },
        ],
      },
    ],
  },
]);
