import { App } from '@/App';
import { withSessionProtected } from '@/common/hocs/withSessionProtected';
import { Filters } from '@/pages/Filters';
import { Overview } from '@/pages/Overview';
import { SignIn } from '@/pages/SignIn';
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
        Component: withSessionProtected(Overview),
      },
      {
        path: 'workflows',
        Component: withSessionProtected(Workflows),
      },
      {
        path: 'workflow-definitions',
        Component: withSessionProtected(WorkflowDefinitions),
      },
      {
        path: 'workflow-definitions/:id',
        Component: withSessionProtected(WorkflowDefinition),
      },
      {
        path: 'filters',
        Component: withSessionProtected(Filters),
      },
      {
        path: 'ui-definitions',
        Component: withSessionProtected(UIDefinitions),
      },
    ],
  },
]);
