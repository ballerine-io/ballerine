import { TWorkflowById } from '@/domains/workflows/fetchers';
import { checkIsWebsiteMonitoringVariant } from '@/lib/blocks/variants/variant-checkers';

export const getProcessTrackerProcesses = (workflow: TWorkflowById) => {
  if (checkIsWebsiteMonitoringVariant(workflow.workflowDefinition)) {
    return ['merchant-monitoring'];
  }

  return;
};
