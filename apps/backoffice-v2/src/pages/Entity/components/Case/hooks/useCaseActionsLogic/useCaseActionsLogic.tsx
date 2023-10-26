import { useCallback, useMemo } from 'react';
import { useApproveCaseMutation } from '../../../../../../domains/entities/hooks/mutations/useApproveCaseMutation/useApproveCaseMutation';
import { useDebounce } from '../../../../../../common/hooks/useDebounce/useDebounce';
import { createInitials } from '../../../../../../common/utils/create-initials/create-initials';
import { IUseActions } from './interfaces';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../useCaseState/useCaseState';
import { useUsersQuery } from '../../../../../../domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { useAssignWorkflowMutation } from '../../../../../../domains/workflows/hooks/mutations/useAssignWorkflowMutation/useAssignWorkflowMutation';
import { useRejectEntityMutation } from '../../../../../../domains/entities/hooks/mutations/useRejectEntityMutation/useRejectEntityMutation';
import { useSelectNextEntity } from '../../../../../../domains/entities/hooks/useSelectNextEntity/useSelectNextEntity';
import { useWorkflowQuery } from '../../../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { useRevisionCaseMutation } from '../../../../../../domains/workflows/hooks/mutations/useRevisionCaseMutation/useRevisionCaseMutation';
import { useCaseDecision } from '../useCaseDecision/useCaseDecision';
import { tagToBadgeData } from '../../consts';

export const useCaseActionsLogic = ({ workflowId, fullName }: IUseActions) => {
  const onSelectNextEntity = useSelectNextEntity();
  const filterId = useFilterId();
  const { data: workflow, isLoading: isLoadingCase } = useWorkflowQuery({ workflowId, filterId });
  const { mutate: mutateApproveEntity, isLoading: isLoadingApproveEntity } = useApproveCaseMutation(
    {
      workflowId: workflowId,
      onSelectNextEntity,
    },
  );
  const { mutate: mutateRevisionCase, isLoading: isLoadingRevisionCase } = useRevisionCaseMutation({
    workflowId: workflowId,
    onSelectNextEntity,
  });
  const { mutate: mutateRejectEntity, isLoading: isLoadingRejectEntity } = useRejectEntityMutation({
    workflowId: workflowId,
    onSelectNextEntity,
  });

  const { mutate: mutateAssignWorkflow, isLoading: isLoadingAssignWorkflow } =
    useAssignWorkflowMutation({ workflowRuntimeId: workflowId });

  const isLoading = isLoadingApproveEntity || isLoadingRejectEntity || isLoadingAssignWorkflow;
  // Create initials from the first character of the first name, middle name, and last name.
  const initials = createInitials(fullName);

  const {
    data: { user: authenticatedUser },
  } = useAuthenticatedUserQuery();
  const caseState = useCaseState(authenticatedUser, workflow);
  const { data: assignees } = useUsersQuery();
  const { hasDecision, canApprove, canReject, canRevision } = useCaseDecision();

  // Only display the button spinners if the request is longer than 300ms
  const debouncedIsLoadingRejectEntity = useDebounce(isLoadingRejectEntity, 300);
  const debouncedIsLoadingRevisionCase = useDebounce(isLoadingRevisionCase, 300);
  const debouncedIsLoadingApproveEntity = useDebounce(isLoadingApproveEntity, 300);
  const debouncedIsLoadingAssignEntity = useDebounce(isLoadingAssignWorkflow, 300);

  // Avoid passing the onClick event to mutate
  const onMutateApproveEntity = useCallback(() => mutateApproveEntity(), [mutateApproveEntity]);
  const onMutateRevisionCase = useCallback(() => mutateRevisionCase(), [mutateRevisionCase]);
  const onMutateRejectEntity = useCallback(() => mutateRejectEntity(), [mutateRejectEntity]);
  const onMutateAssignWorkflow = useCallback(
    (assigneeId: string, isAssignedToMe: boolean) =>
      mutateAssignWorkflow({
        assigneeId,
        isAssignedToMe,
      }),
    [mutateAssignWorkflow],
  );

  const tag = useMemo(() => {
    return workflow?.tags?.find(t => tagToBadgeData[t]);
  }, [workflow]);

  const isActionButtonDisabled = !caseState.actionButtonsEnabled;
  const documentsToReviseCount = workflow?.context?.documents?.filter(
    document => document?.decision?.status === 'revision',
  )?.length;

  const assignedUser = workflow?.assignee
    ? {
        id: workflow?.assignee?.id,
        fullName: `${workflow?.assignee?.firstName} ${workflow?.assignee?.lastName}`,
      }
    : undefined;

  return {
    isActionButtonDisabled,
    onMutateApproveEntity,
    onMutateRevisionCase,
    onMutateRejectEntity,
    onMutateAssignWorkflow,
    debouncedIsLoadingRejectEntity,
    debouncedIsLoadingApproveEntity,
    debouncedIsLoadingRevisionCase,
    debouncedIsLoadingAssignEntity,
    isLoading,
    initials,
    canReject,
    canApprove,
    canRevision,
    caseState,
    authenticatedUser,
    assignees,
    assignedUser,
    hasDecision,
    isLoadingCase,
    documentsToReviseCount,
    tag,
  };
};
