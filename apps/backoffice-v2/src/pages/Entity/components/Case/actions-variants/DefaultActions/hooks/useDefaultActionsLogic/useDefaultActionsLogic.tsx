import { useParams } from 'react-router-dom';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useCaseDecision } from '@/pages/Entity/components/Case/hooks/useCaseDecision/useCaseDecision';
import { useSelectNextCase } from '@/domains/entities/hooks/useSelectNextCase/useSelectNextCase';
import { useApproveCaseMutation } from '@/domains/entities/hooks/mutations/useApproveCaseMutation/useApproveCaseMutation';
import { useRejectCaseMutation } from '@/domains/entities/hooks/mutations/useRejectCaseMutation/useRejectCaseMutation';
import { useRevisionCaseMutation } from '@/domains/workflows/hooks/mutations/useRevisionCaseMutation/useRevisionCaseMutation';
import { useAssignWorkflowMutation } from '@/domains/workflows/hooks/mutations/useAssignWorkflowMutation/useAssignWorkflowMutation';
import { useCallback, useMemo } from 'react';
import { usePendingRevisionEvents } from '@/pages/Entity/components/Case/hooks/usePendingRevisionEvents/usePendingRevisionEvents';
import { useDebounce } from '@/common/hooks/useDebounce/useDebounce';
import { useDocumentsAdapter } from '@/domains/documents/hooks/useDocumentsAdapter/useDocumentsAdapter';
import { selectDirectorsDocuments } from '@/pages/Entity/selectors/selectDirectorsDocuments';
import { StateTag } from '@ballerine/common';

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

  const directorsIds =
    workflow?.context?.entity?.data?.additionalInfo?.directors?.map(
      director => director.ballerineEntityId,
    ) ?? [];
  const { documents } = useDocumentsAdapter({
    entityIds: [workflow?.context?.entity?.ballerineEntityId ?? ''],
    documents: workflow?.context?.documents ?? [],
  });
  const { documents: directorsDocuments } = useDocumentsAdapter({
    entityIds: directorsIds,
    documents: selectDirectorsDocuments(workflow),
  });

  const documentsToReviseCount = useMemo(
    () =>
      [...documents, ...directorsDocuments].filter(
        document => document?.decision?.status === 'revision',
      ).length,
    [documents, directorsDocuments],
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
