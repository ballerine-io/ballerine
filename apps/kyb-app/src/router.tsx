import { withTokenProtected } from '@app/hocs/withTokenProtected';
import { CollectionFlow } from '@app/pages/CollectionFlow';
import { Approved } from '@app/pages/CollectionFlow/components/pages/Approved';
import { Rejected } from '@app/pages/CollectionFlow/components/pages/Rejected';
import { SignIn } from '@app/pages/SignIn';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: withTokenProtected(SignIn),
  },
  {
    path: '/collection-flow',
    Component: withTokenProtected(CollectionFlow),
  },
  {
    path: 'rejected',
    Component: withTokenProtected(Rejected),
  },
  {
    path: 'approved',
    Component: withTokenProtected(Approved),
  },
]);
