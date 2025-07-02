import { endUserFlowStatusToIcon } from '@/common/components/molecules/ProcessTracker/constants';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export const getEndUserFlowStatus = (
  status: NonNullable<TWorkflowById['endUsers'][number]['individualVerificationsChecks']>['status'],
) => {
  return (
    endUserFlowStatusToIcon[status as keyof typeof endUserFlowStatusToIcon] ??
    endUserFlowStatusToIcon.DEFAULT
  );
};
