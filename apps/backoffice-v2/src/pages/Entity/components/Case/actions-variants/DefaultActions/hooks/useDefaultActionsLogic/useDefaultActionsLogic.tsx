import { useDebounce } from '@/common/hooks/useDebounce/useDebounce';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useApproveCaseMutation } from '@/domains/entities/hooks/mutations/useApproveCaseMutation/useApproveCaseMutation';
import { useRejectCaseMutation } from '@/domains/entities/hooks/mutations/useRejectCaseMutation/useRejectCaseMutation';
import { useSelectNextCase } from '@/domains/entities/hooks/useSelectNextCase/useSelectNextCase';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { useAssignWorkflowMutation } from '@/domains/workflows/hooks/mutations/useAssignWorkflowMutation/useAssignWorkflowMutation';
import { useRevisionCaseMutation } from '@/domains/workflows/hooks/mutations/useRevisionCaseMutation/useRevisionCaseMutation';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useDocuments } from '@/lib/blocks/hooks/useDocumentBlocks/hooks/useDocuments';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { usePendingRevisionEvents } from '@/pages/Entity/components/Case/hooks/usePendingRevisionEvents/usePendingRevisionEvents';
import { StateTag } from '@ballerine/common';
import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

export const useDefaultActionsLogic = () => {
  const { entityId: workflowId } = useParams();
  const filterId = useFilterId();

  const { data: workflow } = useWorkflowByIdQuery({
    workflowId: workflowId ?? '',
    filterId: filterId ?? '',
  });

  const { canApprove, canReject, canRevision } = useCaseDecision();

  const onSelectNextCase = useSelectNextCase();

  const { isLoading: isLoadingApproveCase, mutate: mutateApproveCase } = useApproveCaseMutation({
    workflowId: workflow?.id,
    onSelectNextCase,
  });
  const { isLoading: isLoadingRejectCase, mutate: mutateRejectCase } = useRejectCaseMutation({
    workflowId: workflow?.id,
    onSelectNextCase,
  });
  const { mutate: mutateRevisionCase, isLoading: isLoadingRevisionCase } = useRevisionCaseMutation({
    onSelectNextCase,
  });

  const { isLoading: isLoadingAssignWorkflow } = useAssignWorkflowMutation({
    workflowRuntimeId: workflow?.id,
  });

  const isLoadingActions =
    isLoadingApproveCase || isLoadingRejectCase || isLoadingRevisionCase || isLoadingAssignWorkflow;

  // Avoid passing the onClick event to mutate
  const onMutateApproveCase = useCallback(() => mutateApproveCase(), [mutateApproveCase]);
  const onMutateRejectCase = useCallback(() => mutateRejectCase(), [mutateRejectCase]);

  const { onMutateRevisionCase } = usePendingRevisionEvents(mutateRevisionCase, workflow);

  const { documents } = useDocuments(workflow as TWorkflowById);

  const documentsToReviseCount = useMemo(
    () => [...documents].filter(document => document?.decision?.status === 'revision').length,
    [documents],
  );

  // Only display the button spinners if the request is longer than 300ms
  const debouncedIsLoadingRejectCase = useDebounce(isLoadingRejectCase, 300);
  const debouncedIsLoadingRevisionCase = useDebounce(isLoadingRevisionCase, 300);
  const debouncedIsLoadingApproveCase = useDebounce(isLoadingApproveCase, 300);

  return {
    isLoadingActions,
    canRevision:
      canRevision &&
      workflow?.tags?.some(tag => [StateTag.MANUAL_REVIEW, StateTag.PENDING_PROCESS].includes(tag)),
    debouncedIsLoadingRejectCase,
    documentsToReviseCount,
    debouncedIsLoadingRevisionCase,
    onMutateRevisionCase,
    onMutateRejectCase,
    canReject,
    onMutateApproveCase,
    canApprove,
    debouncedIsLoadingApproveCase,
  };
};
