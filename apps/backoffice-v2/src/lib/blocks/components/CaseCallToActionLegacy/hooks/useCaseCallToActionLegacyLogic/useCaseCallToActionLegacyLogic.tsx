import { useCallback, useState } from 'react';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useWorkflowByIdQuery } from '@/domains/workflows/hooks/queries/useWorkflowByIdQuery/useWorkflowByIdQuery';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { TWorkflowById } from '../../../../../../domains/workflows/fetchers';
import { useApproveCaseAndDocumentsMutation } from '../../../../../../domains/entities/hooks/mutations/useApproveCaseAndDocumentsMutation/useApproveCaseAndDocumentsMutation';
import { useRevisionCaseAndDocumentsMutation } from '../../../../../../domains/entities/hooks/mutations/useRevisionCaseAndDocumentsMutation/useRevisionCaseAndDocumentsMutation';
import { useCaseState } from '@/pages/Entity/components/Case/hooks/useCaseState/useCaseState';

export const useCaseCallToActionLegacyLogic = ({
  parentWorkflowId,
  childWorkflowId,
  childWorkflowContextSchema,
}: {
  parentWorkflowId: string;
  childWorkflowId: string;
  childWorkflowContextSchema: NonNullable<
    TWorkflowById['childWorkflows']
  >[number]['workflowDefinition']['contextSchema'];
}) => {
  const filterId = useFilterId();

  // State
  const revisionReasons =
    childWorkflowContextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
      ({ enum: enum_ }) => !!enum_,
    )?.enum as Array<string>;

  const noReasons = !revisionReasons?.length;
  const [reason, setReason] = useState(revisionReasons?.[0] ?? '');
  const [comment, setComment] = useState('');
  const reasonWithComment = comment ? `${reason} - ${comment}` : reason;
  // /State

  // Queries
  const { data: session } = useAuthenticatedUserQuery();
  // Parent workflow
  const { data: parentWorkflow } = useWorkflowByIdQuery({
    workflowId: parentWorkflowId,
    filterId,
  });
  // /Queries

  // Mutations
  const { mutate: mutateApproveCase, isLoading: isLoadingApproveCase } =
    useApproveCaseAndDocumentsMutation({
      workflowId: childWorkflowId,
    });
  const { mutate: mutateRevisionCase, isLoading: isLoadingRevisionCase } =
    useRevisionCaseAndDocumentsMutation({
      workflowId: childWorkflowId,
    });
  // /Mutations

  // Callbacks
  const onReasonChange = useCallback((value: string) => setReason(value), [setReason]);
  const onCommentChange = useCallback((value: string) => setComment(value), [setComment]);
  const onMutateApproveCase = useCallback(() => mutateApproveCase(), [mutateApproveCase]);
  const onMutateRevisionCase = useCallback(
    (revisionReason: string) => () =>
      mutateRevisionCase({
        revisionReason,
      }),
    [mutateRevisionCase],
  );
  // /Callbacks

  const caseState = useCaseState(session?.user, parentWorkflow);
  const isLoading = isLoadingApproveCase || isLoadingRevisionCase;
  const isDisabled = !caseState.actionButtonsEnabled || isLoading;

  return {
    // Callbacks
    onMutateApproveCase,
    onMutateRevisionCase,
    onReasonChange,
    onCommentChange,
    // /Callbacks

    // State
    reason,
    comment,
    noReasons,
    isDisabled,
    reasons: revisionReasons,
    reasonWithComment,
    // /State

    // Loading state
    isLoadingApproveCase,
    isLoadingRevisionCase,
    // Loading states
  };
};
