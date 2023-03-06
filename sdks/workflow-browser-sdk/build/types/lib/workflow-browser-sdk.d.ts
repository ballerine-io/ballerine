import type { WorkflowEventWithoutState } from '@ballerine/workflow-core';
import { Error } from '@ballerine/workflow-core';
import { Event } from './enums';
import type { BrowserWorkflowEvent, TWorkflowErrorEvent, TWorkflowEvent, TWorkflowHttpErrorEvent, WorkflowEventWithBrowserType, WorkflowOptionsBrowser } from './types';
export declare class WorkflowBrowserSDK {
    #private;
    constructor({ backend, ...options }: WorkflowOptionsBrowser);
    subscribe<TEvent extends BrowserWorkflowEvent>(event: TEvent, cb: TEvent extends typeof Event.WILD_CARD ? (event: WorkflowEventWithBrowserType) => void : TEvent extends typeof Error.ERROR ? (event: TWorkflowErrorEvent) => void : TEvent extends typeof Error.HTTP_ERROR ? (event: TWorkflowHttpErrorEvent) => void : (event: TWorkflowEvent) => void): void;
    sendEvent(event: WorkflowEventWithoutState): void;
    getSnapshot(): any;
}
//# sourceMappingURL=workflow-browser-sdk.d.ts.map