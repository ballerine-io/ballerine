import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUsersQuery } from '@/domains/users/hooks/queries/useUsersQuery/useUsersQuery';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { assignAlertsByIds } from '@/domains/alerts/fetchers';

const getToastActionAndContext = ({
  assigneeId,
  assigneeName,
  isAssignedToMe,
}: {
  assigneeId: string | null;
  assigneeName: string | null;
  isAssignedToMe: boolean;
}) => {
  const action = assigneeId ? 'assign_alerts' : 'unassign_alerts';
  const context = assigneeId
    ? {
        assignee: isAssignedToMe ? 'me' : assigneeName,
      }
    : {};

  return { action, context } as const;
};

export const useAssignAlertsByIdsMutation = ({
  onSuccess,
}: {
  onSuccess?: <TData>(
    data: TData,
    { assigneeId, isAssignedToMe }: { assigneeId: string | null; isAssignedToMe: boolean },
    { assigneeName }: { assigneeName: string | null },
  ) => void;
} = {}) => {
  const queryClient = useQueryClient();
  const { data: users } = useUsersQuery();

  return useMutation({
    mutationFn: ({
      assigneeId,
      alertIds,
    }: {
      assigneeId: string | null;
      alertIds: string[];
      isAssignedToMe: boolean;
    }) =>
      assignAlertsByIds({
        assigneeId,
        alertIds,
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
      onSuccess?.(data, { assigneeId, isAssignedToMe }, { assigneeName });
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
