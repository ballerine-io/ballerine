import { App } from '@/App';
import { withSessionProtected } from '@/common/hocs/withSessionProtected';
import { Overview } from '@/pages/Overview';
import { SignIn } from '@/pages/SignIn';
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
        Component: withSessionProtected(Overview),
      },
      {
        path: 'workflows',
        Component: withSessionProtected(Workflows),
      },
    ],
  },
]);
