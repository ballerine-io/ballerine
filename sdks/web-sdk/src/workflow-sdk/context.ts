import { createWorkflowBrowser } from './workflow-sdk-browser';
import { getContext, setContext } from 'svelte';
import { AnyRecord } from '../types';
import { WorkflowService } from './interfaces';

export const setWorkflowContext = (workflowService: WorkflowService) =>
  setContext('workflow', workflowService);

export const getWorkflowContext = () => getContext<WorkflowService>('workflow');

export const initWorkflowContext = (workflow: AnyRecord) => {
  const workflowService = createWorkflowBrowser(workflow);

  setWorkflowContext(workflowService);

  return workflowService;
};
