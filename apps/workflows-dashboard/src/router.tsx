import { App } from '@/App';
import { withSessionProtected } from '@/common/hocs/withSessionProtected';
import { AlertDefinitions } from '@/pages/AlertDefinitions';
import { Filters } from '@/pages/Filters';
import { Overview } from '@/pages/Overview';
import { SignIn } from '@/pages/SignIn';
import { UIDefinition } from '@/pages/UIDefinition';
import { UIDefinitions } from '@/pages/UIDefinitions';
import { WorkflowDefinition } from '@/pages/WorkflowDefinition';
import { WorkflowDefinitions } from '@/pages/WorkflowDefinitions';
import { Workflows } from '@/pages/Workflows';
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
        path: '/auth/signin',
        Component: SignIn,
      },
      {
        path: 'overview',
        // TODO: get rid of this hook and rework routing to use authenticated layout
        Component: Overview,
      },
      {
        path: 'workflows',
        Component: Workflows,
      },
      {
        path: 'workflow-definitions',
        Component: WorkflowDefinitions,
      },
      {
        path: 'workflow-definitions/:id',
        Component: WorkflowDefinition,
      },
      {
        path: 'filters',
        Component: Filters,
      },
      {
        path: 'ui-definitions',
        Component: UIDefinitions,
      },
      {
        path: 'ui-definitions/:id',
        Component: UIDefinition,
      },
      {
        path: 'alert-definitions',
        Component: AlertDefinitions,
      },
    ],
  },
]);
