import { CreateWorkflow } from './types';
import { WorkflowNodeSDK } from './workflow-node-sdk';

export const createWorkflow: CreateWorkflow = options => new WorkflowNodeSDK(options);
