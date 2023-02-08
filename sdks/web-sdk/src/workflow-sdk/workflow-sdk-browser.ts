import {
  BrowserWorkflowEvent,
  TSubscribers,
  WorkflowEventCallback,
  WorkflowEventWithBrowserType,
  WorkflowWildcardEventCallback,
} from './types';
import {
  createWorkflow,
  WorkflowEventWithoutState,
  WorkflowOptions,
} from '@ballerine/workflow-sdk-core';
import { createMachine } from 'xstate';

export class WorkflowBrowserSDK {
  #__subscribers: TSubscribers = [];
  #__service;

  constructor({ WorkflowDef, ...machine }: WorkflowOptions) {
    const service = createMachine(WorkflowDef);

    this.#__service = createWorkflow({
      ...machine,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      WorkflowDef: service,
    });

    this.#__service.subscribe(event => {
      this.#__notify(event);
    });
  }

  #__notify({ type, payload, state }: WorkflowEventWithBrowserType) {
    this.#__subscribers.forEach(sub => {
      if (sub.event !== '*' && sub.event !== type) return;

      sub.cb({ type: sub.event === '*' ? type : undefined, payload, state });
    });
  }

  subscribe<TEvent extends BrowserWorkflowEvent>(
    event: TEvent,
    cb: TEvent extends '*' ? WorkflowWildcardEventCallback : WorkflowEventCallback,
  ) {
    this.#__subscribers.push({ event, cb });
  }

  sendEvent(event: WorkflowEventWithoutState) {
    this.#__service.sendEvent(event);
  }

  getSnapshot() {
    return this.#__service.getSnapshot();
  }
}

type CreateWorkflowBrowser = (workflow: WorkflowOptions) => WorkflowBrowserSDK;

export const createWorkflowBrowser: CreateWorkflowBrowser = workflow =>
  new WorkflowBrowserSDK(workflow);
