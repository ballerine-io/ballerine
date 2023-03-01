import { CreateWorkflow } from './types';
import { WorkflowBrowserSDK } from './workflow-browser-sdk';

export const createWorkflow: CreateWorkflow = options => new WorkflowBrowserSDK(options);
