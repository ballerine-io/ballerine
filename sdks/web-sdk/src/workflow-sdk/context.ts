import { createWorkflowBrowser, WorkflowBrowserSDK } from './workflow-sdk-browser';
import { getContext, setContext } from 'svelte';
import { WorkflowOptions } from '@ballerine/workflow-sdk-core';

export const setWorkflowContext = (workflowService: WorkflowBrowserSDK) =>
  setContext('workflow', workflowService);

export const getWorkflowContext = () => getContext<WorkflowBrowserSDK>('workflow');

export const initWorkflowContext = (workflow: WorkflowOptions) => {
  const workflowService = createWorkflowBrowser(workflow);

  setWorkflowContext(workflowService);

  return workflowService;
};
