import { useActiveWorkflowQuery } from '@app/hooks/useActiveWorkflowQuery';
import { withSessionProtected } from '@app/hooks/useSignin/hocs/withSessionProtected';
import { LoadingScreen } from '@app/pages/CollectionFlow/components/atoms/LoadingScreen';
import { Outlet } from 'react-router-dom';

export const CollectionFlowDumb = () => {
  const { isFetching } = useActiveWorkflowQuery();

  if (isFetching) {
    return <LoadingScreen />;
  }

  return <Outlet />;
};

export const CollectionFlow = withSessionProtected(CollectionFlowDumb);
