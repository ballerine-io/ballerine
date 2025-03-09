import { ComponentProps, FunctionComponent, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useApproveTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useApproveTaskByIdMutation/useApproveTaskByIdMutation';
import { useRejectTaskByIdMutation } from '../../../../../../domains/entities/hooks/mutations/useRejectTaskByIdMutation/useRejectTaskByIdMutation';
import { TWorkflowById } from '../../../../../../domains/workflows/fetchers';
import { useRejectDocumentByIdMutation } from '@/domains/documents/hooks/mutations/useRejectDocumentByIdMutation/useRejectDocumentByIdMutation';
import { useApproveDocumentByIdMutation } from '@/domains/documents/hooks/mutations/useApproveDocumentByIdMutation/useApproveDocumentByIdMutation';

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
  const { mutate: mutateApproveDocumentById, isLoading: isLoadingApproveDocumentById } =
    useApproveDocumentByIdMutation();

  const { mutate: mutateRejectTaskById, isLoading: isLoadingRejectTaskById } =
    useRejectTaskByIdMutation(workflow?.id);
  const { mutate: mutateRejectDocumentById, isLoading: isLoadingRejectDocumentById } =
    useRejectDocumentByIdMutation();

  const isLoadingDecisionByIdV1 = isLoadingApproveTaskById || isLoadingRejectTaskById;
  const isLoadingDecisionByIdV2 = isLoadingApproveDocumentById || isLoadingRejectDocumentById;
  const isLoadingTaskDecisionById = [
    isLoadingDecisionByIdV1,
    isLoadingDecisionByIdV2,
    isLoadingReuploadNeeded,
  ].some(Boolean);

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

  const onMutateDecisionByIdV1 = useCallback(
    (payload: {
      id: string;
      decision: 'approve' | 'reject' | 'revision';
      comment?: string;
      reason?: string;
    }) => {
      if (payload?.decision === 'approve') {
        return mutateApproveTaskById({
          documentId: payload?.id,
          contextUpdateMethod,
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
  const onMutateDecisionByIdV2 = useCallback(
    (payload: {
      id: string;
      decision: 'approve' | 'reject' | 'revision';
      comment?: string;
      reason?: string;
    }) => {
      if (payload?.decision === 'approve') {
        return mutateApproveDocumentById({
          documentId: payload?.id,
          decisionReason: payload?.reason ?? '',
          comment,
        });
      }

      if (payload?.decision === 'reject') {
        return mutateRejectDocumentById({
          documentId: payload?.id,
          decisionReason: payload?.reason,
          comment,
        });
      }

      if (payload?.decision === 'revision') {
        return onReuploadNeeded({
          workflowId: workflow?.id,
          documentId: payload?.id,
          reason: payload?.reason,
          comment,
        })();
      }

      toast.error('Invalid decision');
    },
    [comment, mutateApproveDocumentById, mutateRejectDocumentById, onReuploadNeeded, workflow?.id],
  );
  const onMutateTaskDecisionById = useCallback(
    (payload: {
        id: string;
        decision: 'approve' | 'reject' | 'revision';
        comment?: string;
        reason?: string;
      }) =>
      () => {
        if (!payload?.id) {
          toast.error('Invalid task id');

          return;
        }

        if (workflow?.workflowDefinition?.config?.isDocumentsV2) {
          return onMutateDecisionByIdV2(payload);
        }

        return onMutateDecisionByIdV1(payload);
      },
    [
      onMutateDecisionByIdV1,
      onMutateDecisionByIdV2,
      workflow?.workflowDefinition?.config?.isDocumentsV2,
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
