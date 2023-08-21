import { useActiveWorkflowQuery } from '@app/hooks/useActiveWorkflowQuery';
import { useCollectionFlowSchemaQuery } from '@app/hooks/useCollectionFlowSchemaQuery';
import { withSessionProtected } from '@app/hooks/useSessionQuery/hocs/withSessionProtected';
import { LoadingScreen } from '@app/pages/CollectionFlow/components/atoms/LoadingScreen';
import { Outlet, Navigate } from 'react-router-dom';

export const CollectionFlowDumb = () => {
  const { documentConfigurations } = useCollectionFlowSchemaQuery();
  const { isFetching, flowData } = useActiveWorkflowQuery(documentConfigurations);

  if (isFetching) {
    return <LoadingScreen />;
  }

  if (flowData?.workflow?.state === 'approve') {
    return <Navigate to="/approved" />;
  }

  if (flowData?.workflow?.state === 'reject') {
    return <Navigate to="/rejected" />;
  }

  return <Outlet />;
};

export const CollectionFlow = withSessionProtected(CollectionFlowDumb);
