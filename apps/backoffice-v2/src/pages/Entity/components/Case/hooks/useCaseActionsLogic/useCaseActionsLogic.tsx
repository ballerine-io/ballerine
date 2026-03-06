import { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useDebounce } from '@/common/hooks/useDebounce/useDebounce';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useSerializedSearchParams } from '@/common/hooks/useSerializedSearchParams/useSerializedSearchParams';
import { createInitials } from '@/common/utils/create-initials/create-initials';
import { useAuthenticatedUserQuery } from '@/domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useNotesByNoteable } from '@/domains/notes/hooks/queries/useNotesByNoteable/useNotesByNoteable';
import { useUsersQuery } from '@/domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import { useAssignWorkflowMutation } from '@/domains/workflows/hooks/mutations/useAssignWorkflowMutation/useAssignWorkflowMutation';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { tagToBadgeData } from '../../consts';
import { useCaseDecision } from '../useCaseDecision/useCaseDecision';
import { useCaseState } from '../useCaseState/useCaseState';
import { IUseActions } from './interfaces';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUpdateWorkflowById } from '@/domains/workflows/fetchers';
import { getActiveTag } from '@/common/utils/get-active-tag/get-active-tag';

export const useCaseActionsLogic = ({ workflowId, fullName }: IUseActions) => {
  const filterId = useFilterId();
  const queryClient = useQueryClient();
  const { data: workflow, isLoading: isLoadingCase } = useWorkflowByIdQuery({
    workflowId,
    filterId,
  });

  const { entityId } = useParams();
  const { data: notes } = useNotesByNoteable({ noteableId: entityId, noteableType: 'Workflow' });

  const [{ isNotesOpen }, setSearchParams] = useSerializedSearchParams();
  const setIsNotesOpen = (open: boolean) => setSearchParams({ isNotesOpen: open });

  const { mutate: mutateAssignWorkflow, isLoading: isLoadingAssignWorkflow } =
    useAssignWorkflowMutation({ workflowRuntimeId: workflowId });

  // Create initials from the first character of the first name, middle name, and last name.
  const initials = createInitials(fullName);

  const { data: session } = useAuthenticatedUserQuery();
  const authenticatedUser = session?.user;
  const caseState = useCaseState(authenticatedUser, workflow);
  const { data: assignees } = useUsersQuery();
  const { hasDecision, canApprove, canReject, canRevision } = useCaseDecision();

  // Only display the button spinners if the request is longer than 300ms
  const debouncedIsLoadingAssignEntity = useDebounce(isLoadingAssignWorkflow, 300);

  // Avoid passing the onClick event to mutate
  const onMutateAssignWorkflow = useCallback(
    (assigneeId: string, isAssignedToMe: boolean) =>
      mutateAssignWorkflow({
        assigneeId,
        isAssignedToMe,
      }),
    [mutateAssignWorkflow],
  );

  const tag = useMemo(
    () => getActiveTag(workflow?.tags),
    [workflow?.tags],
  ) as keyof typeof tagToBadgeData;

  const isActionButtonDisabled = !caseState.actionButtonsEnabled;

  const assignedUser = workflow?.assignee
    ? {
        id: workflow?.assignee?.id,
        fullName: `${workflow?.assignee?.firstName} ${workflow?.assignee?.lastName}`,
        avatarUrl: workflow?.assignee?.avatarUrl,
      }
    : undefined;

  const isWorkflowCompleted = workflow?.status === 'completed';

  // Custom labels from context.metadata
  const customLabels = useMemo(() => {
    const labels = (workflow?.context?.metadata as Record<string, unknown>)?.customLabels;

    return Array.isArray(labels) ? (labels as string[]) : [];
  }, [workflow?.context?.metadata]);

  const { mutate: mutateCustomLabels } = useMutation({
    mutationFn: (newLabels: string[]) =>
      fetchUpdateWorkflowById({
        workflowId,
        body: {
          context: {
            metadata: {
              ...(workflow?.context?.metadata ?? {}),
              customLabels: newLabels,
            },
          },
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workflows'] });
    },
  });

  const onAddCustomLabel = useCallback(
    (label: string) => {
      if (!customLabels.includes(label)) {
        mutateCustomLabels([...customLabels, label]);
      }
    },
    [customLabels, mutateCustomLabels],
  );

  const onRemoveCustomLabel = useCallback(
    (label: string) => {
      mutateCustomLabels(customLabels.filter(l => l !== label));
    },
    [customLabels, mutateCustomLabels],
  );

  return {
    isActionButtonDisabled,
    onMutateAssignWorkflow,
    debouncedIsLoadingAssignEntity,
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
    tag,
    workflow,
    workflowDefinition: workflow?.workflowDefinition,
    isWorkflowCompleted,
    avatarUrl: workflow?.entity?.avatarUrl || '',
    notes,
    isNotesOpen: isNotesOpen === 'true',
    setIsNotesOpen,
    customLabels,
    onAddCustomLabel,
    onRemoveCustomLabel,
  };
};
