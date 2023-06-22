import { useParams } from 'react-router-dom';
import { useFilterId } from '../../../../../../common/hooks/useFilterId/useFilterId';
import { useWorkflowQuery } from '../../../../../../domains/workflows/hooks/queries/useWorkflowQuery/useWorkflowQuery';
import { useAuthenticatedUserQuery } from '../../../../../../domains/auth/hooks/queries/useAuthenticatedUserQuery/useAuthenticatedUserQuery';
import { useCaseState } from '../../../Case/hooks/useCaseState/useCaseState';
import { useUpdateWorkflowByIdMutation } from '../../../../../../domains/workflows/hooks/mutations/useUpdateWorkflowByIdMutation/useUpdateWorkflowByIdMutation';
import toast from 'react-hot-toast';
import { useCallback, useState } from 'react';

export const useCallToActionLogic = () => {
  const { entityId } = useParams();
  const filterId = useFilterId();
  const { data: workflow } = useWorkflowQuery({ workflowId: entityId, filterId });
  const { data: session } = useAuthenticatedUserQuery();
  const caseState = useCaseState(session?.user, workflow);
  const { mutate: mutateUpdateWorkflowById, isLoading: isLoadingUpdateWorkflowById } =
    useUpdateWorkflowByIdMutation({
      workflowId: workflow.id,
    });
  const onMutateUpdateWorkflowById =
    (
      payload:
        | {
            id: string;
            approvalStatus: 'approved';
          }
        | {
            id: string;
            approvalStatus: 'revision' | 'rejected';
            reason: string;
          },
    ) =>
    () => {
      if (!payload?.id) {
        toast.error('Invalid task id');

        return;
      }

      const action = (
        {
          approved: 'approve_document',
          rejected: 'reject_document',
          revision: 'ask_resubmit_document',
        } as const
      )[payload.approvalStatus];

      const context = {
        documents: workflow.context.documents?.map(document => {
          if (document?.id !== payload?.id) return document;

          switch (payload?.approvalStatus) {
            case 'approved':
              return {
                ...document,
                decision: {
                  revisionReason: null,
                  rejectionReason: null,
                  status: payload?.approvalStatus,
                },
              };
            case 'rejected':
              return {
                ...document,
                decision: {
                  revisionReason: null,
                  // Change when rejection reason is implemented.
                  rejectionReason: payload?.reason,
                  status: payload?.approvalStatus,
                },
              };
            case 'revision':
              return {
                ...document,
                decision: {
                  revisionReason: payload?.reason,
                  rejectionReason: null,
                  status: payload?.approvalStatus,
                },
              };
            default:
              return document;
          }
        }),
      };
      return mutateUpdateWorkflowById({
        context,
        action,
      });
    };
  const revisionReasons =
    workflow.workflowDefinition.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.revisionReason?.anyOf?.find(
      ({ enum: enum_ }) => !!enum_,
    )?.enum;
  const rejectionReasons =
    workflow.workflowDefinition.contextSchema?.schema?.properties?.documents?.items?.properties?.decision?.properties?.rejectionReason?.anyOf?.find(
      ({ enum: enum_ }) => !!enum_,
    )?.enum;
  const actions = [
    {
      label: 'Revision',
      value: 'revision',
    },
    {
      label: 'Reject',
      value: 'rejected',
    },
  ] as const;
  const [action, setAction] = useState<(typeof actions)[number]['value']>(actions[0].value);
  const reasons = action === 'revision' ? revisionReasons : rejectionReasons;
  const [reason, setReason] = useState(reasons?.[0] ?? '');
  const onReasonChange = useCallback((value: string) => setReason(value), [setReason]);
  const onActionChange = useCallback((value: typeof action) => setAction(value), [setAction]);

  return {
    onMutateUpdateWorkflowById,
    isLoadingUpdateWorkflowById,
    caseState,
    action,
    actions,
    reasons,
    reason,
    onReasonChange,
    onActionChange,
  };
};
