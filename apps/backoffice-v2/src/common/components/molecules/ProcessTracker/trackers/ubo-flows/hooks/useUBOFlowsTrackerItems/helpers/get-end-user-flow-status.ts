import { endUserFlowStatusToIcon } from '@/common/components/molecules/ProcessTracker/constants';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export const getEndUserFlowStatus = (endUser: TWorkflowById['endUsers'][number]) => {
  const { status } = endUser.individualVerificationsChecks || {};

  return (
    endUserFlowStatusToIcon[status as keyof typeof endUserFlowStatusToIcon] ??
    endUserFlowStatusToIcon.DEFAULT
  );
};
