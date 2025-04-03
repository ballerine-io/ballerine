import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { documentsQueryKeys } from '../../query-keys';
import { checkIsNonEmptyArrayOfNonEmptyStrings } from '@ballerine/common';

export const useDocumentsByEntityIdsAndWorkflowIdQuery = ({
  workflowId,
  entityIds,
}: {
  workflowId: string;
  entityIds: string[];
}) => {
  const isEnabled = useMemo(
    () => !!workflowId && checkIsNonEmptyArrayOfNonEmptyStrings(entityIds),
    [workflowId, entityIds],
  );
  const query = useQuery({
    ...documentsQueryKeys.listByEntityIdsAndWorkflowId({ workflowId, entityIds }),
    enabled: isEnabled,
  });

  const isLoading = useMemo(
    () => (isEnabled ? query.isLoading : false),
    [query.isLoading, isEnabled],
  );

  return {
    ...query,
    isLoading,
  };
};
