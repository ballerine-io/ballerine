import { TCreateWorkflowCoreReturn, WorkflowOptionsNode } from './types';
import { createWorkflow } from '@ballerine/workflow-core';

export class WorkflowNodeSDKInstance {
  #__service: TCreateWorkflowCoreReturn;

  constructor(options: WorkflowOptionsNode) {
    this.#__service = createWorkflow(options);
  }

  subscribe(
    eventName: Parameters<TCreateWorkflowCoreReturn['subscribe']>[0],
    callback: Parameters<TCreateWorkflowCoreReturn['subscribe']>[1],
  ) {
    this.#__service.subscribe(eventName, callback);
  }

  async sendEvent(event: Parameters<TCreateWorkflowCoreReturn['sendEvent']>[0]) {
    return await this.#__service.sendEvent(event);
  }

  getSnapshot() {
    return this.#__service.getSnapshot();
  }
}
