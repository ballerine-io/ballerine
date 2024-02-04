import { TWorkflowById } from '@/domains/workflows/fetchers';
import { checkIfWebsiteMonitoringVariant } from '@/lib/blocks/variants/variant-checkers';

export const getProcessTrackerProcesses = (workflow: TWorkflowById) => {
  if (checkIfWebsiteMonitoringVariant(workflow.workflowDefinition)) {
    return ['merchant-monitoring'];
  }

  return undefined;
};
