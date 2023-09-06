import { AppErrorScreen } from '@app/common/components/molecules/AppErrorScreen';
import { withTokenProtected } from '@app/hocs/withTokenProtected/withTokenProtected';
import { AccessRestricted } from '@app/pages/AccessRestricted';
import { CollectionFlow } from '@app/pages/CollectionFlow';
import { KYB } from '@app/pages/CollectionFlow/components/organisms/KYBView';
import { Approved } from '@app/pages/CollectionFlow/components/pages/Approved';
import { Rejected } from '@app/pages/CollectionFlow/components/pages/Rejected';
import { Success } from '@app/pages/CollectionFlow/components/pages/Success';
import { SignIn } from '@app/pages/SignIn';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: withTokenProtected(SignIn),
  },
  {
    path: '/signin',
    Component: withTokenProtected(SignIn),
  },
  {
    path: '/collection-flow',
    Component: withTokenProtected(CollectionFlow),
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
    Component: withTokenProtected(Rejected),
  },
  {
    path: 'approved',
    Component: withTokenProtected(Approved),
  },
  {
    path: 'restricted',
    element: <AccessRestricted />,
  },
]);
