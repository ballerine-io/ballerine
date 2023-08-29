import { DocumentConfiguration, collectionFlowQuerykeys } from '@app/domains/collection-flow';
import { useSessionQuery } from '@app/hooks/useSessionQuery';
import { useQuery } from '@tanstack/react-query';

export const useActiveWorkflowQuery = (documentConfigurations: DocumentConfiguration[]) => {
  const { user } = useSessionQuery();
  const { data: flowData = null, isFetching } = useQuery({
    ...collectionFlowQuerykeys.getFlowData({ endUserId: user?.id, documentConfigurations }),
    enabled: Boolean(user),
    staleTime: Infinity,
  });

  return {
    flowData,
    isFetching: isFetching,
    workflow: flowData ? flowData.workflow : null,
  };
};
