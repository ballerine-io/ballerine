import { CreateWorkflowClient } from './types';
import { WorkflowNodeSDK } from './workflow-node-sdk';

export const createWorkflowClient: CreateWorkflowClient = options => new WorkflowNodeSDK(options);
