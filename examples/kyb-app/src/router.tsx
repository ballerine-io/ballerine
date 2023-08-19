import { CollectionFlow } from '@app/pages/CollectionFlow';
import { KYB } from '@app/pages/CollectionFlow/components/organisms/KYBView';
import { Approved } from '@app/pages/CollectionFlow/components/pages/Approved';
import { Rejected } from '@app/pages/CollectionFlow/components/pages/Rejected';
import { Success } from '@app/pages/CollectionFlow/components/pages/Success';
import { SignIn } from '@app/pages/SignIn';
import { createBrowserRouter, Navigate } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: SignIn,
  },
  {
    path: '/signin',
    Component: SignIn,
  },
  {
    path: '/collection-flow',
    element: <CollectionFlow />,
    children: [
      {
        path: '',
        element: <KYB />,
        children: [
          {
            path: 'success',
            element: <Success />,
          },
        ],
      },
    ],
  },
  {
    path: 'rejected',
    element: <Rejected />,
  },
  {
    path: 'approved',
    element: <Approved />,
  },
  {
    path: '*',
    element: <Navigate to="/" />,
  },
]);
