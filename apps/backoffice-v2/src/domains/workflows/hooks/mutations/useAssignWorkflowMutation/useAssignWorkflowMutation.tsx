import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { t } from 'i18next';
import { updateWorkflowSetAssignById } from '../../../fetchers';
import { useUsersQuery } from '../../../../users/hooks/queries/useUsersQuery/useUsersQuery';

const getToastActionAndContext = ({
  assigneeId,
  assigneeName,
  isAssignedToMe,
}: {
  assigneeId: string | null;
  assigneeName: string | null;
  isAssignedToMe: boolean;
}) => {
  const action = assigneeId ? 'assign_case' : 'unassign_case';
  const context = assigneeId
    ? {
        assignee: isAssignedToMe ? 'me' : assigneeName,
      }
    : {};

  return { action, context } as const;
};

export const useAssignWorkflowMutation = ({ workflowRuntimeId }: { workflowRuntimeId: string }) => {
  const queryClient = useQueryClient();
  const { data: users } = useUsersQuery();

  return useMutation({
    mutationFn: ({ assigneeId }: { assigneeId: string | null; isAssignedToMe: boolean }) =>
      updateWorkflowSetAssignById({
        workflowId: workflowRuntimeId,
        body: {
          assigneeId,
        },
      }),
    onMutate: ({ assigneeId }) => {
      const assigneeName = assigneeId
        ? users?.find(({ id }) => id === assigneeId)?.fullName ?? ''
        : '';

      return { assigneeName };
    },
    onSuccess: (data, { assigneeId, isAssignedToMe }, { assigneeName }) => {
      void queryClient.invalidateQueries();

      const { action, context } = getToastActionAndContext({
        assigneeId,
        assigneeName,
        isAssignedToMe,
      });

      toast.success(t(`toast:${action}.success`, context));
    },
    onError: (error, { assigneeId, isAssignedToMe }, { assigneeName }) => {
      const { action, context } = getToastActionAndContext({
        assigneeId,
        assigneeName,
        isAssignedToMe,
      });

      toast.error(t(`toast:${action}.error`, context));
    },
  });
};
