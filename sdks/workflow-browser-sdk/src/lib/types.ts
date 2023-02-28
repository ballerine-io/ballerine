import type { WorkflowEvent, WorkflowOptions } from '@ballerine/workflow-core';
import type { BaseActionObject } from 'xstate';
import type { Error, Event } from './enums';
import type { WorkflowBrowserSDK } from './workflow-browser-sdk';

export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<Serializable>
  | { [key: PropertyKey]: Serializable };

export type AnyRecord = Record<PropertyKey, any>;

export type ObjectValues<TObject> = TObject[keyof TObject];

export type DeepPartial<TValue> = {
  [TKey in keyof TValue]?: TValue[TKey] extends Record<any, any>
    ? DeepPartial<TValue[TKey]>
    : TValue extends Array<infer U>
    ? Array<DeepPartial<U>>
    : TValue[TKey];
};

export interface BackendEndpoint {
  endpoint: URL | string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'GET';
}

export interface BackendOptions {
  /**
   * @default 'https://api-dev.ballerine.io'
   */
  baseUrl: URL | string;
  /**
   * A partial URL, just an endpoint to append to the baseUrl.
   */
  endpoints: {
    /**
     * @default '/workflows/submit'
     */
    submit: BackendEndpoint;
    /**
     * @default '/workflows/persist'
     */
    persist: BackendEndpoint;
  };
  headers?: {
    Authorization?: string;
    credentials?: RequestCredentials;
  } & HeadersInit;
}

export interface WorkflowOptionsBrowser
  extends Omit<WorkflowOptions, 'workflowActions' | 'workflowActors'> {
  backend?: DeepPartial<BackendOptions>;
  persistStates?: Array<string>;
  submitStates?: Array<string>;
}

export type BrowserWorkflowEvent =
  | typeof Event.USER_NEXT_STEP
  | typeof Event.USER_PREV_STEP
  | typeof Event.STATE_ACTION_STATUS
  | typeof Error.ERROR
  | typeof Error.HTTP_ERROR
  | typeof Event.WILD_CARD
  | string;

export type WorkflowEventWithBrowserType = Omit<WorkflowEvent, 'type' | 'error'> & {
  //   error?: InstanceType<typeof HttpError> | unknown;
  type: BrowserWorkflowEvent;
};

export type TSubscriber = {
  event: BrowserWorkflowEvent;
  cb(
    event:
      | {
          type: BrowserWorkflowEvent;
          payload?: AnyRecord;
          state: string;
          //   error?: InstanceType<typeof HttpError> | unknown;
        }
      | {
          type: BrowserWorkflowEvent;
          state: string;
        }
      | {
          type: typeof Error.ERROR;
          state: string;
          //   error: InstanceType<typeof HttpError> | unknown;
        }
      | {
          type: typeof Error.HTTP_ERROR;
          state: string;
          //   error: InstanceType<typeof HttpError>;
        }
      | {
          type: BrowserWorkflowEvent;
          payload?: AnyRecord;
          state: string;
        }
      | {
          payload?: AnyRecord;
          state: string;
        },
  ): void;
};
export type TSubscribers = Array<TSubscriber>;

export interface IUserStepEvent {
  type: string;
  payload: Record<PropertyKey, any>;
}

export interface IOnProps {
  target?: string;
  actions?: BaseActionObject[];
}

export type CreateWorkflow = (
  options: Omit<WorkflowOptionsBrowser, 'workflowActions' | 'workflowActors'>,
) => InstanceType<typeof WorkflowBrowserSDK>;

export type TWorkflowEvent = Omit<WorkflowEvent, 'type' | 'error'>;

export type TWorkflowErrorEvent = TWorkflowEvent & {
  type: typeof Error.ERROR | typeof Error.HTTP_ERROR;
  //   error: InstanceType<typeof HttpError> | unknown;
};

export type TWorkflowHttpErrorEvent = TWorkflowEvent & {
  //   error: InstanceType<typeof HttpError>;
};
