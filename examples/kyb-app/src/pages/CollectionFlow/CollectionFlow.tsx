import { useActiveWorkflowQuery } from '@app/hooks/useActiveWorkflowQuery';
import { withSessionProtected } from '@app/hooks/useSignin/hocs/withSessionProtected';
import { LoadingScreen } from '@app/common/components/molecules/LoadingScreen';
import { Outlet, Navigate } from 'react-router-dom';

export const CollectionFlowDumb = () => {
  const { isFetching, workflow } = useActiveWorkflowQuery();

  if (isFetching) {
    return <LoadingScreen />;
  }

  if (workflow?.state === 'approve') {
    return <Navigate to="/approved" />;
  }

  if (workflow?.state === 'reject') {
    return <Navigate to="/rejected" />;
  }

  return <Outlet />;
};

export const CollectionFlow = withSessionProtected(CollectionFlowDumb);
