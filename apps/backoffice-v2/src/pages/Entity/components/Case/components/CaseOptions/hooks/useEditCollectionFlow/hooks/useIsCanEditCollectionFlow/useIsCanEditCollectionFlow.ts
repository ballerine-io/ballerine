import { useIsAssignedToMe } from '@/common/hooks/useIsAssignedToMe';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { StateTag } from '@ballerine/common';
import { useMemo } from 'react';

interface IUseIsCanEditCollectionFlowProps {
  assigneeId: string;
  tags: TWorkflowById['tags'];
  config: TWorkflowById['workflowDefinition']['config'];
}

export const useIsCanEditCollectionFlow = ({
  assigneeId,
  tags,
  config,
}: IUseIsCanEditCollectionFlowProps) => {
  const isAssignedToMe = useIsAssignedToMe({
    assigneeId,
  });

  const isInManualReview = useMemo(() => tags?.some(tag => tag === StateTag.MANUAL_REVIEW), [tags]);

  return config?.isAgentEditingEnabled && isAssignedToMe && isInManualReview;
};
