import { AnyRecord } from '../types';
import { WorkflowEvent, WorkflowEventListener, WorkflowSendEvent } from './types';

export interface IWorkflowEventCallbackParams {
  type: WorkflowEvent;
  payload?: AnyRecord;
  state: AnyRecord;
}

export interface WorkflowService {
  sendEvent: WorkflowSendEvent;
  subscribe: WorkflowEventListener;
}
