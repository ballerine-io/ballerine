import { WorkflowEvent } from '@ballerine/workflow-sdk-core';
import { AnyRecord, ComputeDeep } from '../types';

export type BrowserWorkflowEvent =
  | 'ui-step'
  | 'life-cycle-step'
  | 'remote-step'
  | 'local-step'
  | '*'
  | string;

export type WorkflowEventWithBrowserType = ComputeDeep<
  Omit<WorkflowEvent, 'type'> & {
    type: BrowserWorkflowEvent;
  }
>;

export type WorkflowEventCallback = (event: Omit<WorkflowEvent, 'type'>) => void;

export type WorkflowWildcardEventCallback = (event: WorkflowEventWithBrowserType) => void;

export type TSubscriber = {
  event: BrowserWorkflowEvent;
  cb(
    event:
      | {
          payload?: AnyRecord;
          state: string;
        }
      | {
          type: BrowserWorkflowEvent;
          payload?: AnyRecord;
          state: string;
        },
  ): void;
};
export type TSubscribers = Array<TSubscriber>;
