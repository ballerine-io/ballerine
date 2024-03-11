import { useParams } from 'react-router-dom';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useSelectNextCase } from '@/domains/entities/hooks/useSelectNextCase/useSelectNextCase';
import { useAssignWorkflowMutation } from '@/domains/workflows/hooks/mutations/useAssignWorkflowMutation/useAssignWorkflowMutation';
import { useCallback } from 'react';
import { useDebounce } from '@/common/hooks/useDebounce/useDebounce';
import { useDismissCaseMutation } from '@/domains/entities/hooks/mutations/useDismissCaseMutation/useDismissCaseMutation';
import { useFlagCaseMutation } from '@/domains/entities/hooks/mutations/useFlagCaseMutation/useFlagCaseMutation';
import { Action } from '@/common/enums';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';

export const useOngoingActionsLogic = () => {
  const { entityId } = useParams();
  const filterId = useFilterId();

  const { data: workflow } = useWorkflowByIdQuery({
    workflowId: entityId ?? '',
    filterId: filterId ?? '',
  });

  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);

  const canDismiss =
    caseState.actionButtonsEnabled && workflow?.nextEvents?.includes(Action.DISMISS);
  const canFlag = caseState.actionButtonsEnabled && workflow?.nextEvents?.includes(Action.FLAG);

  const onSelectNextCase = useSelectNextCase();

  const { isLoading: isLoadingDismissCase, mutate: mutateDismissCase } = useDismissCaseMutation({
    workflowId: workflow?.id,
    onSelectNextCase,
  });
  const { isLoading: isLoadingFlagCase, mutate: mutateFlagCase } = useFlagCaseMutation({
    workflowId: workflow?.id,
    onSelectNextCase,
  });

  const { isLoading: isLoadingAssignWorkflow } = useAssignWorkflowMutation({
    workflowRuntimeId: workflow?.id,
  });

  const isLoadingActions = isLoadingDismissCase || isLoadingFlagCase || isLoadingAssignWorkflow;

  // Avoid passing the onClick event to mutate
  const onMutateDismissCase = useCallback(() => mutateDismissCase(), [mutateDismissCase]);
  const onMutateFlagCase = useCallback(() => mutateFlagCase(), [mutateFlagCase]);

  // Only display the button spinners if the request is longer than 300ms
  const debouncedIsLoadingFlagCase = useDebounce(isLoadingFlagCase, 300);
  const debouncedIsLoadingDismissCase = useDebounce(isLoadingDismissCase, 300);

  return {
    isLoadingActions,
    debouncedIsLoadingFlagCase,
    onMutateFlagCase,
    canFlag,
    onMutateDismissCase,
    canDismiss,
    debouncedIsLoadingDismissCase,
  };
};
