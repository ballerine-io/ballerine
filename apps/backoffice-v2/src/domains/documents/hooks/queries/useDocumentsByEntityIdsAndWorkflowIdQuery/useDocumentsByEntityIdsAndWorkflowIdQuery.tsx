import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { documentsQueryKeys } from '../../query-keys';
import { checkIsNonEmptyArrayOfNonEmptyStrings } from '@/common/utils/check-is-non-empty-array-of-non-empty-strings/check-is-non-empty-array-of-non-empty-strings';

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
