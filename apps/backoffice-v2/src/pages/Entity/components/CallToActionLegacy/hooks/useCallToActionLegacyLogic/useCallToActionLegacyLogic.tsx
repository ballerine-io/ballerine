import { CommonWorkflowEvent } from '@ballerine/common';
import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useApproveTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useApproveTaskByIdMutation/useApproveTaskByIdMutation';
import { useRejectTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useRejectTaskByIdMutation/useRejectTaskByIdMutation';
import { useRevisionTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useRevisionTaskByIdMutation/useRevisionTaskByIdMutation';
import { TWorkflowById } from '../../../../../../domains/workflows/fetchers';
import { useDocumentSelection } from 'src/pages/Entity/components/DirectorsCallToAction/hooks/useDocumentSelection';
import { ICallToActionDocumentSelection } from '@/pages/Entity/components/DirectorsCallToAction/interfaces';

export interface UseCallToActionLogicParams {
  contextUpdateMethod?: 'base' | 'director';
  revisionReasons?: string[];
  rejectionReasons?: string[];
  documentSelection?: ICallToActionDocumentSelection;
  onReuploadReset?: () => void;
  onDialogClose?: () => void;
  workflow: TWorkflowById;
}

export const getPostApproveEventNameEvent = (workflow: TWorkflowById) => {
  if (
    !workflow?.workflowDefinition?.config?.workflowLevelResolution &&
    workflow?.nextEvents?.includes(CommonWorkflowEvent.TASK_REVIEWED)
  ) {
    return CommonWorkflowEvent.TASK_REVIEWED;
  }
};
export const useCallToActionLegacyLogic = (params: UseCallToActionLogicParams) => {
  const {
    contextUpdateMethod = 'base',
    rejectionReasons,
    revisionReasons,
    documentSelection,
    onReuploadReset,
    onDialogClose,
    workflow,
  } = params;
  const postUpdateEventName = getPostApproveEventNameEvent(workflow);

  const { mutate: mutateApproveTaskById, isLoading: isLoadingApproveTaskById } =
    useApproveTaskByIdMutation(workflow?.id, postUpdateEventName);
  const { mutate: mutateRejectTaskById, isLoading: isLoadingRejectTaskById } =
    useRejectTaskByIdMutation(workflow?.id, postUpdateEventName);
  const { mutate: mutateRevisionTaskById, isLoading: isLoadingRevisionTaskById } =
    useRevisionTaskByIdMutation(workflow?.id, postUpdateEventName);

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

  const resetReasonAndComment = useCallback(() => {
    setReason('');
    setComment('');
  }, []);

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
            contextUpdateMethod,
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

  const documentPickerProps = useDocumentSelection(documentSelection, resetReasonAndComment);

  const handleDialogClose = useCallback(
    (isOpen: boolean) => {
      // Calling callback only when dialog is closed.
      if (isOpen || !onDialogClose) return;

      onDialogClose();
    },
    [onDialogClose],
  );

  return {
    isLoadingTaskDecisionById,
    action,
    actions,
    reasons,
    reason,
    comment,
    documentPickerProps,
    onReasonChange,
    onActionChange,
    onCommentChange,
    handleDialogClose,
    noReasons,
    onMutateTaskDecisionById,
    workflowLevelResolution,
    isReuploadResetable,
  };
};
