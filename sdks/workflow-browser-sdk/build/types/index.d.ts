/**
 * workflow-browser-sdk
 *
 * Copyright (c) Ballerine
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
import { WorkflowEventWithoutState, WorkflowOptions, WorkflowEvent } from '@ballerine/workflow-core';

declare const Event: {
    readonly WILD_CARD: "*";
    readonly USER_NEXT_STEP: "USER_NEXT_STEP";
    readonly USER_PREV_STEP: "USER_PREV_STEP";
    readonly ERROR: "ERROR";
    readonly STATE_ACTION_STATUS: "STATE_ACTION_STATUS";
};
declare const Action: {
    readonly USER_NEXT_STEP: "USER_NEXT_STEP";
    readonly USER_PREV_STEP: "USER_PREV_STEP";
    readonly ERROR: "ERROR";
};
declare const Error: {
    readonly ERROR: "ERROR";
    readonly HTTP_ERROR: "HTTP_ERROR";
};
declare const Errors: readonly ["ERROR", "HTTP_ERROR"];

declare class WorkflowBrowserSDK {
    #private;
    constructor({ backend, ...options }: WorkflowOptionsBrowser);
    subscribe<TEvent extends BrowserWorkflowEvent>(event: TEvent, cb: TEvent extends typeof Event.WILD_CARD ? (event: WorkflowEventWithBrowserType) => void : TEvent extends typeof Error.ERROR ? (event: TWorkflowErrorEvent) => void : TEvent extends typeof Error.HTTP_ERROR ? (event: TWorkflowHttpErrorEvent) => void : (event: TWorkflowEvent) => void): void;
    sendEvent(event: WorkflowEventWithoutState): void;
    getSnapshot(): Record<PropertyKey, any>;
}

type DeepPartial<TValue> = {
    [TKey in keyof TValue]?: TValue[TKey] extends Record<any, any> ? DeepPartial<TValue[TKey]> : TValue extends Array<infer U> ? Array<DeepPartial<U>> : TValue[TKey];
};
interface BackendEndpoint {
    endpoint: URL | string;
    method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' | "GET";
}
interface BackendOptions {
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
interface WorkflowOptionsBrowser extends Omit<WorkflowOptions, 'workflowActions' | 'workflowActors'> {
    backend?: DeepPartial<BackendOptions>;
    persistStates?: Array<string>;
}
type BrowserWorkflowEvent = typeof Event.USER_NEXT_STEP | typeof Event.USER_PREV_STEP | typeof Event.STATE_ACTION_STATUS | typeof Error.ERROR | typeof Error.HTTP_ERROR | typeof Event.WILD_CARD | string;
type WorkflowEventWithBrowserType = Omit<WorkflowEvent, 'type' | 'error'> & {
    type: BrowserWorkflowEvent;
};
type CreateWorkflow = (options: Omit<WorkflowOptionsBrowser, 'workflowActions' | 'workflowActors'>) => InstanceType<typeof WorkflowBrowserSDK>;
type TWorkflowEvent = Omit<WorkflowEvent, 'type' | 'error'>;
type TWorkflowErrorEvent = TWorkflowEvent & {
    type: typeof Error.ERROR | typeof Error.HTTP_ERROR;
};
type TWorkflowHttpErrorEvent = TWorkflowEvent & {};

declare const createWorkflow: CreateWorkflow;

export { Action, Error, Errors, Event, WorkflowBrowserSDK, WorkflowOptionsBrowser, createWorkflow };
