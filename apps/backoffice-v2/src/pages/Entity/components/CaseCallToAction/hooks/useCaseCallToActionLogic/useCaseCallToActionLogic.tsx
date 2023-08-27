import { useCallback, useState } from 'react';
import { useCaseState } from '../../../Case/hooks/useCaseState/useCaseState';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useWorkflowQuery } from '../../../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { TWorkflowById } from '../../../../../../domains/workflows/fetchers';
import { useApproveCaseAndDocumentsMutation } from '../../../../../../domains/entities/hooks/mutations/useApproveCaseAndDocumentsMutation/useApproveCaseAndDocumentsMutation';
import { useRevisionCaseAndDocumentsMutation } from '../../../../../../domains/entities/hooks/mutations/useRevisionCaseAndDocumentsMutation/useRevisionCaseAndDocumentsMutation';

export const useCaseCallToActionLogic = ({
  parentWorkflowId,
  childWorkflowId,
  childWorkflowContextSchema,
}: {
  parentWorkflowId: string;
  childWorkflowId: string;
  childWorkflowContextSchema: TWorkflowById['childWorkflows'][number]['workflowDefinition']['contextSchema'];
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
  const { data: parentWorkflow } = useWorkflowQuery({
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
      revisionReason: reasonWithComment,
    });
  // /Mutations

  // Callbacks
  const onReasonChange = useCallback((value: string) => setReason(value), [setReason]);
  const onCommentChange = useCallback((value: string) => setComment(value), [setComment]);
  const onMutateApproveCase = useCallback(() => mutateApproveCase(), [mutateApproveCase]);
  const onMutateRevisionCase = useCallback(() => mutateRevisionCase(), [mutateRevisionCase]);
  // /Callbacks

  const caseState = useCaseState(session.user, parentWorkflow);
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
    // /State

    // Loading state
    isLoadingApproveCase,
    isLoadingRevisionCase,
    // Loading states
  };
};
