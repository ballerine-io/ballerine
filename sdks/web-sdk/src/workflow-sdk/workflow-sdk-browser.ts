import { createWorkflowCore } from './workflow-sdk-core';
import { AnyRecord } from '../types';
import { TNotifyParams, TSubscribers, WorkflowEventListener, WorkflowSendEvent } from './types';
import { IWorkflowEventCallbackParams } from './interfaces';

export const createWorkflowBrowser = (workflow: AnyRecord) => {
  const subscribers: TSubscribers = [];
  const notify = ({ event, payload, state }: TNotifyParams) =>
    subscribers.forEach(sub => {
      if (sub.event !== '*' && sub.event !== event) return;

      sub.cb({ payload, state, event: sub.event === '*' ? event : undefined });
    });
  const workflowService = createWorkflowCore(workflow);

  const subscribe: WorkflowEventListener = (event, cb) => {
    subscribers.push({ event, cb });
  };
  const sendEvent: WorkflowSendEvent = ({ type, payload }) =>
    workflowService.sendEvent({ type, payload });

  workflowService.subscribe(({ type, payload, state }: IWorkflowEventCallbackParams) => {
    notify({ event: type, payload, state: state });
  });

  return {
    getSnapshot: workflowService.getSnapshot,
    setContext: workflowService.setContext,
    sendEvent,
    subscribe,
  };
};
