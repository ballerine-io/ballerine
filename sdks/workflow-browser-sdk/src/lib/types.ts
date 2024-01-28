import type { Error, HttpError, WorkflowEvent, WorkflowOptions } from '@ballerine/workflow-core';
import type { BaseActionObject } from 'xstate';
import type { Event, Persistence } from './enums';
import type { WorkflowBrowserSDK } from './workflow-browser-sdk';

export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Serializable[]
  | { [key: PropertyKey]: Serializable };

export type AnyRecord = Record<PropertyKey, unknown>;

export type ObjectValues<TObject> = TObject[keyof TObject];

export type DeepPartial<TValue> = {
  [TKey in keyof TValue]?: TValue[TKey] extends Record<string, unknown>
    ? DeepPartial<TValue[TKey]>
    : TValue extends Array<infer U>
    ? Array<DeepPartial<U>>
    : TValue[TKey];
};

export interface IPersistState {
  state: string;
  persistence: ObjectValues<typeof Persistence>;
}

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
     * @default PUT '/workflows/:workflowId'
     */
    persist: BackendEndpoint;
    /**
     * @default POST '/storage'
     */
    uploadFile: BackendEndpoint;
  };
  headers?: {
    Authorization?: string;
    credentials?: RequestCredentials;
  } & HeadersInit;
}

export interface WorkflowOptionsBrowser extends Omit<WorkflowOptions, 'workflowActions'> {
  backend?: DeepPartial<BackendOptions>;
  persistStates?: IPersistState[];
  submitStates?: Array<Omit<IPersistState, 'persistence'>>;
}

export type BrowserWorkflowEvent =
  | typeof Event.WILD_CARD
  | typeof Event.USER_NEXT_STEP
  | typeof Event.USER_PREV_STEP
  | typeof Event.STATE_ACTION_STATUS
  | typeof Error.ERROR
  | typeof Error.HTTP_ERROR;

export type WorkflowEventWithBrowserType = Omit<WorkflowEvent, 'type' | 'error'> & {
  error?: InstanceType<typeof HttpError> | unknown;
  type: BrowserWorkflowEvent;
};

export type TWorkflowStateActionStatusEvent = TWorkflowEvent & {
  payload: {
    status: 'PENDING' | 'ERROR' | 'SUCCESS';
    action: `SYNC_${typeof Persistence.LOCAL_STORAGE | typeof Persistence.BACKEND}`;
  };
  error?: InstanceType<typeof HttpError> | unknown;
};

export type TSubscriber = {
  event: BrowserWorkflowEvent;
  cb(
    event:
      | {
          type: BrowserWorkflowEvent;
          payload?: AnyRecord;
          state: string;
          error?: InstanceType<typeof HttpError> | unknown;
        }
      | {
          type: BrowserWorkflowEvent;
          state: string;
        }
      | {
          type: typeof Error.ERROR;
          state: string;
          error: InstanceType<typeof HttpError> | unknown;
        }
      | {
          type: typeof Error.HTTP_ERROR;
          state: string;
          error: InstanceType<typeof HttpError>;
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
export type TSubscribers = TSubscriber[];

export interface IUserStepEvent {
  type: string;
  payload: Record<PropertyKey, unknown>;
}

export interface IOnProps {
  target?: string;
  actions?: BaseActionObject[];
}

export type WorkflowBrowserSDKParams = ConstructorParameters<typeof WorkflowBrowserSDK>[0];

export type CreateWorkflow = (
  options: WorkflowBrowserSDKParams,
) => InstanceType<typeof WorkflowBrowserSDK>;

export type TWorkflowEvent = Omit<WorkflowEvent, 'type' | 'error'>;

export type TWorkflowErrorEvent = TWorkflowEvent & {
  type: typeof Error.ERROR | typeof Error.HTTP_ERROR;
  error: InstanceType<typeof HttpError> | unknown;
};

export type TWorkflowHttpErrorEvent = TWorkflowEvent & {
  error: InstanceType<typeof HttpError>;
};

export interface IFileToUpload {
  type: string;
  file: File;
}
