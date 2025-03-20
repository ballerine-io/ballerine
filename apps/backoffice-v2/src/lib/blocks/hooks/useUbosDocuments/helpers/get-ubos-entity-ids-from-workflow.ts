import { TWorkflowById } from '@/domains/workflows/fetchers';

export const getUbosEntityIdsFromWorkflow = (workflow: TWorkflowById) => {
  return workflow.childWorkflows?.map(childWorkflow => childWorkflow.entity.id) ?? [];
};
