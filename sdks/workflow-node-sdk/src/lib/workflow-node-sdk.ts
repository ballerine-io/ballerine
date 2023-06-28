import { WorkflowNodeSDKInstance } from './workflow-node-sdk-instance';
import { WorkflowClientOptions } from '@ballerine/workflow-core';
import { WorkflowOptionsNode } from './types';

export class WorkflowNodeSDK {
  #__options: WorkflowClientOptions;

  constructor(options: WorkflowClientOptions = {}) {
    this.#__options = options;
  }

  createWorkflow(options: WorkflowOptionsNode) {
    return new WorkflowNodeSDKInstance({
      ...options,
      ...this.#__options,
    });
  }
}
