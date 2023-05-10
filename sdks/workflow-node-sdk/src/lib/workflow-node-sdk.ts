import { createWorkflow } from '@ballerine/workflow-core';
import { TCreateWorkflowCoreReturn, WorkflowOptionsNode } from './types';

export class WorkflowNodeSDK {
  #__service: TCreateWorkflowCoreReturn;

  constructor(options: WorkflowOptionsNode) {
    this.#__service = createWorkflow(options);
  }

  subscribe(callback: Parameters<TCreateWorkflowCoreReturn['subscribe']>[0]) {
    this.#__service.subscribe(callback);
  }

  async sendEvent(event: Parameters<TCreateWorkflowCoreReturn['sendEvent']>[0]) {
    this.#__service.sendEvent(event);
  }

  getSnapshot() {
    return this.#__service.getSnapshot();
  }
}
