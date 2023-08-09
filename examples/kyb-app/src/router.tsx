import { CollectionFlow } from '@app/pages/CollectionFlow';
import { KYB } from '@app/pages/CollectionFlow/components/organisms/KYBView';
import { Success } from '@app/pages/CollectionFlow/components/pages/Success';
import { SignIn } from '@app/pages/SignIn';
import { createBrowserRouter } from 'react-router-dom';

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
            Component: Success,
          },
        ],
      },
    ],
  },
]);
