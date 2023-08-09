import { useParams } from 'react-router-dom';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '../../../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../../../Case/hooks/useCaseState/useCaseState';
import toast from 'react-hot-toast';
import { useCallback, useState } from 'react';
import { useApproveTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useApproveTaskByIdMutation/useApproveTaskByIdMutation';
import { useRejectTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useRejectTaskByIdMutation/useRejectTaskByIdMutation';
import { useRevisionTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useRevisionTaskByIdMutation/useRevisionTaskByIdMutation';

export const useCallToActionLogic = () => {
  const { entityId } = useParams();
  const filterId = useFilterId();
  const { data: workflow } = useWorkflowQuery({ workflowId: entityId, filterId });
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const { mutate: mutateApproveTaskById, isLoading: isLoadingApproveTaskById } =
    useApproveTaskByIdMutation(workflow?.id);
  const { mutate: mutateRejectTaskById, isLoading: isLoadingRejectTaskById } =
    useRejectTaskByIdMutation(workflow?.id);
  const { mutate: mutateRevisionTaskById, isLoading: isLoadingRevisionTaskById } =
    useRevisionTaskByIdMutation(workflow?.id);
  const revisionReasons =
    workflow?.workflowDefinition?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
      ({ enum: enum_ }) => !!enum_,
    )?.enum;
  const rejectionReasons =
    workflow?.workflowDefinition?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.rejectionReason?.anyOf?.find(
      ({ enum: enum_ }) => !!enum_,
    )?.enum;
  const actions = [
    {
      label: 'Ask to re-submit',
      value: 'revision',
    },
    {
      label: 'Block',
      value: 'reject',
    },
  ] as const;
  const [action, setAction] = useState<(typeof actions)[number]['value']>(actions[0].value);
  const reasons = action === 'revision' ? revisionReasons : rejectionReasons;
  const noReasons = !reasons?.length;
  const [reason, setReason] = useState(reasons?.[0] ?? '');
  const [comment, setComment] = useState('');
  const onReasonChange = useCallback((value: string) => setReason(value), [setReason]);
  const onActionChange = useCallback((value: typeof action) => setAction(value), [setAction]);
  const onCommentChange = useCallback((value: string) => setComment(value), [setComment]);
  const isLoadingTaskDecisionById =
    isLoadingApproveTaskById || isLoadingRejectTaskById || isLoadingRevisionTaskById;
  const onMutateTaskDecisionById = useCallback(
    (
        payload:
          | {
              id: string;
              decision: 'approve';
            }
          | {
              id: string;
              decision: 'reject' | 'revision';
              reason?: string;
            },
      ) =>
      () => {
        if (!payload?.id) {
          toast.error('Invalid task id');

          return;
        }

        if (payload?.decision === 'approve') {
          return mutateApproveTaskById({
            documentId: payload?.id,
          });
        }

        if (payload?.decision === 'reject') {
          return mutateRejectTaskById({
            documentId: payload?.id,
            reason: payload?.reason,
          });
        }

        if (payload?.decision === 'revision') {
          return mutateRevisionTaskById({
            documentId: payload?.id,
            reason: payload?.reason,
          });
        }

        toast.error('Invalid decision');
      },
    [mutateApproveTaskById, mutateRejectTaskById, mutateRevisionTaskById],
  );

  return {
    onMutateTaskDecisionById,
    isLoadingTaskDecisionById,
    caseState,
    action,
    actions,
    reasons,
    reason,
    comment,
    onReasonChange,
    onActionChange,
    onCommentChange,
    noReasons,
  };
};
