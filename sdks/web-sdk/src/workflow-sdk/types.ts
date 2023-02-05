import { RenameProperty } from '../types';
import { IWorkflowEventCallbackParams } from './interfaces';

export type WorkflowEvent =
  | 'ui-step'
  | 'life-cycle-step'
  | 'remote-step'
  | 'local-step'
  | '*'
  | string;
export type WorkflowEventCallback = (
  event: Omit<IWorkflowEventCallbackParams, 'type'> &
    Partial<RenameProperty<Pick<IWorkflowEventCallbackParams, 'type'>, 'type', 'event'>>,
) => void;
export type WorkflowEventListener = (event: WorkflowEvent, cb: WorkflowEventCallback) => void;
export type WorkflowSendEvent = (event: Omit<IWorkflowEventCallbackParams, 'state'>) => void;

export type TSubscriber = { event: WorkflowEvent; cb: WorkflowEventCallback };
export type TSubscribers = Array<TSubscriber>;
export type TNotifyParams = RenameProperty<IWorkflowEventCallbackParams, 'type', 'event'>;
