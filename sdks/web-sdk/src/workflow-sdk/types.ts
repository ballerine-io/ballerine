import { AnyRecord, RenameProperty } from '../types';
import { IWorkflowEventCallbackParams } from './interfaces';

export type WorkflowEvent =
  | 'ui-step'
  | 'life-cycle-step'
  | 'remote-step'
  | 'local-step'
  | '*'
  | string;
export type WorkflowEventCallback = (event: Omit<IWorkflowEventCallbackParams, 'type'>) => void;

export type WorkflowWildcardEventCallback = (
  event: RenameProperty<IWorkflowEventCallbackParams, 'type', 'event'>,
) => void;

export type WorkflowEventListener = <TEvent extends WorkflowEvent>(
  event: TEvent,
  cb: TEvent extends '*' ? WorkflowWildcardEventCallback : WorkflowEventCallback,
) => void;

export type WorkflowSendEvent = (event: Omit<IWorkflowEventCallbackParams, 'state'>) => void;

export type TSubscriber = {
  event: WorkflowEvent;
  cb: (
    event:
      | {
          payload?: AnyRecord;
          state: AnyRecord;
        }
      | {
          payload?: AnyRecord;
          state: AnyRecord;
          event: WorkflowEvent;
        },
  ) => void;
};
export type TSubscribers = Array<TSubscriber>;
export type TNotifyParams = RenameProperty<IWorkflowEventCallbackParams, 'type', 'event'>;
