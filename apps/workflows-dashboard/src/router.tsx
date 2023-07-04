import { App } from '@app/App';
import { withSessionProtected } from '@app/common/hocs/withSessionProtected';
import { Overview } from '@app/pages/Overview';
import { SignIn } from '@app/pages/SignIn';
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
        path: '/auth/signin',
        Component: SignIn,
      },
      {
        path: 'overview',
        Component: withSessionProtected(Overview),
      },
      {
        path: 'workflows',
        Component: withSessionProtected(Workflows),
      },
    ],
  },
]);
