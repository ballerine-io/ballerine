import type { WorkflowBrowserSDK, WorkflowOptionsBrowser } from '@ballerine/workflow-browser-sdk';
import { createWorkflow } from '@ballerine/workflow-browser-sdk';
import { getContext, setContext } from 'svelte';

export const setWorkflowContext = (service: InstanceType<typeof WorkflowBrowserSDK>) => {
  setContext('workflow', service);
};

export const getWorkflowContext = () =>
  getContext<InstanceType<typeof WorkflowBrowserSDK>>('workflow');

export const initWorkflowContext = (options: WorkflowOptionsBrowser) => {
  const workflowService = createWorkflow(options);

  setWorkflowContext(workflowService);

  return workflowService;
};
