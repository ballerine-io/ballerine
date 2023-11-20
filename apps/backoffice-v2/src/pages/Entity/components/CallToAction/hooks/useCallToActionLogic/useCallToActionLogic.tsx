import { useParams } from 'react-router-dom';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '../../../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../../../Case/hooks/useCaseState/useCaseState';
import toast from 'react-hot-toast';
import { useCallback, useEffect, useState } from 'react';
import { useApproveTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useApproveTaskByIdMutation/useApproveTaskByIdMutation';
import { useRejectTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useRejectTaskByIdMutation/useRejectTaskByIdMutation';
import { useRevisionTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useRevisionTaskByIdMutation/useRevisionTaskByIdMutation';
import { TWorkflowById } from '../../../../../../domains/workflows/fetchers';
import { CommonWorkflowEvent } from '@ballerine/common';

export interface UseCallToActionLogicParams {
  contextUpdateMethod?: 'base' | 'director';
  revisionReasons?: string[];
  rejectionReasons?: string[];
  onReuploadReset?: () => void;
}

const getPostUpdateEventNameEvent = (workflow: TWorkflowById) => {
  if (!workflow?.workflowDefinition?.config?.workflowLevelResolution) {
    return CommonWorkflowEvent.TASK_REVIEWED;
  }
};
export const useCallToActionLogic = (params: UseCallToActionLogicParams) => {
  const {
    contextUpdateMethod = 'base',
    rejectionReasons,
    revisionReasons,
    onReuploadReset,
  } = params;
  const { entityId } = useParams();
  const filterId = useFilterId();
  const { data: workflow } = useWorkflowQuery({ workflowId: entityId, filterId });
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const postUpdateEventName = getPostUpdateEventNameEvent(workflow);

  const { mutate: mutateApproveTaskById, isLoading: isLoadingApproveTaskById } =
    useApproveTaskByIdMutation(workflow?.id, postUpdateEventName);
  const { mutate: mutateRejectTaskById, isLoading: isLoadingRejectTaskById } =
    useRejectTaskByIdMutation(workflow?.id, postUpdateEventName);
  const { mutate: mutateRevisionTaskById, isLoading: isLoadingRevisionTaskById } =
    useRevisionTaskByIdMutation(workflow?.id, postUpdateEventName);

  // const revisionReasons =
  //   workflow?.workflowDefinition?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
  //     ({ enum: enum_ }) => !!enum_,
  //   )?.enum;
  // const rejectionReasons =
  //   workflow?.workflowDefinition?.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.rejectionReason?.anyOf?.find(
  //     ({ enum: enum_ }) => !!enum_,
  //   )?.enum;
  const isLoadingTaskDecisionById =
    isLoadingApproveTaskById || isLoadingRejectTaskById || isLoadingRevisionTaskById;

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

  const onMutateTaskDecisionById = useCallback(
    (
        payload:
          | {
              id: string;
              decision: 'approve';
            }
          | {
              id: string;
              decision: 'reject' | 'revision' | 'revised';
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

        if (payload?.decision === null) {
          return mutateRejectTaskById({
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
            decision: payload?.decision,
            contextUpdateMethod,
          });
        }

        toast.error('Invalid decision');
      },
    [contextUpdateMethod, mutateApproveTaskById, mutateRejectTaskById, mutateRevisionTaskById],
  );
  const workflowLevelResolution =
    workflow?.workflowDefinition?.config?.workflowLevelResolution ??
    workflow?.context?.entity?.type === 'business';

  useEffect(() => {
    setReason(reasons?.[0] ?? '');
  }, [action, reasons]);

  const isReuploadResetable = Boolean(onReuploadReset);

  return {
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
    onMutateTaskDecisionById,
    workflowLevelResolution,
    isReuploadResetable,
  };
};
