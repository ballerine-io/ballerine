import { StoreAdapter, WorkflowData } from './types';

export class MemoryStore implements StoreAdapter {
  #__store: Record<PropertyKey, Record<PropertyKey, WorkflowData>>;

  constructor() {
    this.#__store = {};
  }

  // Get all active workflows for entity
  find(entityId: string) {
    const entityWorkflows: string[] = [];
    for (const workflowId in this.#__store) {
      if (this.#__store[workflowId]![entityId]) {
        entityWorkflows.push(workflowId);
      }
    }

    return entityWorkflows;
  }

  get(workflowId: string, entityId: string): WorkflowData | undefined {
    return this.#__store[workflowId]?.[entityId];
  }

  put(workflowId: string, entityId: string, data: WorkflowData) {
    if (this.#__store[workflowId] === undefined) {
      this.#__store[workflowId] = {};
    }
    this.#__store[workflowId]![entityId] = data;
  }

  remove(workflowId: string, entityId: string) {
    if (this.#__store[workflowId] !== undefined) {
      delete this.#__store[workflowId]![entityId];
    }
  }
}
