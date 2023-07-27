import { useCallback, useState } from 'react';
import { useCaseState } from '../../../Case/hooks/useCaseState/useCaseState';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useWorkflowQuery } from '../../../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { TWorkflowById } from '../../../../../../domains/workflows/fetchers';
import { useApproveCaseAndDocumentsMutation } from '../../../../../../domains/entities/hooks/mutations/useApproveCaseAndDocumentsMutation/useApproveCaseAndDocumentsMutation';
import { useRejectCaseAndDocumentsMutation } from '../../../../../../domains/entities/hooks/mutations/useRejectCaseAndDocumentsMutation/useRejectCaseAndDocumentsMutation';
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
  const rejectionReasons =
    childWorkflowContextSchema?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.rejectionReason?.anyOf?.find(
      ({ enum: enum_ }) => !!enum_,
    )?.enum as Array<string>;
  const actions = [
    {
      label: 'Ask to re-submit',
      value: 'revision',
    },
    {
      label: 'Block',
      value: 'rejected',
    },
  ] as const;
  const [action, setAction] = useState<(typeof actions)[number]['value']>(actions[0].value);
  const reasons = action === 'revision' ? revisionReasons : rejectionReasons;
  const noReasons = !reasons?.length;
  const [reason, setReason] = useState(reasons?.[0] ?? '');
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
  const { mutate: mutateRejectCase, isLoading: isLoadingRejectCase } =
    useRejectCaseAndDocumentsMutation({
      workflowId: childWorkflowId,
      rejectionReason: reasonWithComment,
    });
  // /Mutations

  // Callbacks
  const onReasonChange = useCallback((value: string) => setReason(value), [setReason]);
  const onActionChange = useCallback((value: typeof action) => setAction(value), [setAction]);
  const onCommentChange = useCallback((value: string) => setComment(value), [setComment]);
  const onMutateApproveCase = useCallback(() => mutateApproveCase(), [mutateApproveCase]);
  const onMutateRevisionCase = useCallback(() => mutateRevisionCase(), [mutateRevisionCase]);
  const onMutateRejectCase = useCallback(() => mutateRejectCase(), [mutateRejectCase]);
  // /Callbacks

  const caseState = useCaseState(session.user, parentWorkflow);
  const isLoading = isLoadingApproveCase || isLoadingRevisionCase || isLoadingRejectCase;
  const isDisabled = !caseState.actionButtonsEnabled || isLoading;

  return {
    // Callbacks
    onMutateApproveCase,
    onMutateRevisionCase,
    onMutateRejectCase,
    onReasonChange,
    onActionChange,
    onCommentChange,
    // /Callbacks

    // State
    actions,
    action,
    reason,
    comment,
    reasons,
    noReasons,
    isDisabled,
    // /State

    // Loading state
    isLoadingApproveCase,
    isLoadingRevisionCase,
    isLoadingRejectCase,
    // Loading states
  };
};
