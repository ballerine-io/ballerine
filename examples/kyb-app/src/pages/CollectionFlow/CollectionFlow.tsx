import { useActiveWorkflowQuery } from '@app/hooks/useActiveWorkflowQuery';
import { useCollectionFlowSchemaQuery } from '@app/hooks/useCollectionFlowSchemaQuery';
import { withSessionProtected } from '@app/hooks/useSessionQuery/hocs/withSessionProtected';
import { LoadingScreen } from '@app/pages/CollectionFlow/components/atoms/LoadingScreen';
import { Outlet, Navigate } from 'react-router-dom';

export const CollectionFlowDumb = () => {
  const { documentConfigurations, isLoading } = useCollectionFlowSchemaQuery();
  const { isFetching, workflow } = useActiveWorkflowQuery(documentConfigurations);

  if (isFetching || isLoading) {
    return <LoadingScreen />;
  }

  if (workflow?.state === 'approved') {
    return <Navigate to="/approved" />;
  }

  if (workflow?.state === 'rejected') {
    return <Navigate to="/rejected" />;
  }

  return <Outlet />;
};

export const CollectionFlow = withSessionProtected(CollectionFlowDumb);
