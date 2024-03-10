import { CommonWorkflowEvent } from '@ballerine/common';
import { ComponentProps, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useApproveTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useApproveTaskByIdMutation/useApproveTaskByIdMutation';
import { useRejectTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useRejectTaskByIdMutation/useRejectTaskByIdMutation';
import { TWorkflowById } from '../../../../../../domains/workflows/fetchers';

export interface IUseCallToActionLogicParams {
  contextUpdateMethod?: 'base' | 'director';
  revisionReasons?: string[];
  rejectionReasons?: string[];
  onReuploadReset?: () => void;
  onDialogClose?: () => void;
  workflow: TWorkflowById;
  onReuploadNeeded: ({
    workflowId,
    documentId,
    reason,
  }: {
    workflowId: string;
    documentId: string;
    reason?: string;
  }) => () => void;
  isLoadingReuploadNeeded: boolean;
  dialog: {
    reupload: {
      Description: FunctionComponent;
    };
  };
}

export const useCallToActionLegacyLogic = ({
  contextUpdateMethod = 'base',
  rejectionReasons,
  revisionReasons,
  onReuploadReset,
  onDialogClose,
  workflow,
  onReuploadNeeded,
  isLoadingReuploadNeeded,
  dialog,
}: IUseCallToActionLogicParams) => {
  const { mutate: mutateApproveTaskById, isLoading: isLoadingApproveTaskById } =
    useApproveTaskByIdMutation(workflow?.id);
  const { mutate: mutateRejectTaskById, isLoading: isLoadingRejectTaskById } =
    useRejectTaskByIdMutation(workflow?.id);

  const isLoadingTaskDecisionById =
    isLoadingApproveTaskById || isLoadingRejectTaskById || isLoadingReuploadNeeded;

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
          return onReuploadNeeded({
            workflowId: workflow?.id,
            documentId: payload?.id,
            reason: payload?.reason,
          })();
        }

        toast.error('Invalid decision');
      },
    [
      contextUpdateMethod,
      mutateApproveTaskById,
      mutateRejectTaskById,
      onReuploadNeeded,
      workflow?.id,
    ],
  );
  const workflowLevelResolution =
    workflow?.workflowDefinition?.config?.workflowLevelResolution ??
    workflow?.context?.entity?.type === 'business';

  useEffect(() => {
    setReason(reasons?.[0] ?? '');
  }, [action, reasons]);

  const isReuploadResetable = Boolean(onReuploadReset);

  const handleDialogClose = useCallback(
    (isOpen: boolean) => {
      // Calling callback only when dialog is closed.
      if (isOpen || !onDialogClose) return;

      onDialogClose();
    },
    [onDialogClose],
  );
  const DialogDescription: FunctionComponent<
    ComponentProps<(typeof dialog)['reupload']['Description']>
  > = () => {
    if (dialog?.reupload?.Description) {
      return <dialog.reupload.Description />;
    }

    return null;
  };

  return {
    isLoadingTaskDecisionById,
    action,
    actions,
    reasons,
    reason,
    comment,
    onReasonChange,
    onActionChange,
    onCommentChange,
    handleDialogClose,
    noReasons,
    onMutateTaskDecisionById,
    workflowLevelResolution,
    isReuploadResetable,
    DialogDescription,
  };
};
