/**
 * workflow-core
 *
 * Copyright (c) Ballerine
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */
import { MachineConfig, MachineOptions } from 'xstate';

interface Workflow {
    subscribe: (callback: (event: WorkflowEvent) => void) => void;
    sendEvent: (event: Omit<WorkflowEvent, 'state'>) => void;
    getSnapshot: () => Record<PropertyKey, any>;
}
interface WorkflowContext {
    id: string;
    state: any;
    localContextData: any;
    sessionData: any;
    lockKey: string;
}
interface WorkflowPlugin {
    when: 'pre' | 'post';
    action: (options: {
        context: any;
        event: any;
        currentState: any;
    }) => Promise<void>;
}
interface StatePlugin extends Omit<WorkflowPlugin, 'when'> {
    /**
     * The actions key to inject an action function into.
     * E.g. { actions: { [plugin.name]: plugin.action  } }
     */
    name: string;
    /**
     * entry - fire an action when transitioning into a specified state
     * exit  - fire an action when transitioning out of a specified state
     */
    when: 'entry' | 'exit';
    /**
     * States already defined in the statechart
     */
    stateNames: Array<string>;
}
interface GlobalPlugin extends WorkflowPlugin {
    stateName: string;
}
interface WorkflowEvent {
    type: string;
    state: string;
    payload?: Record<PropertyKey, any>;
    error?: unknown;
}
interface WorkflowExtensions {
    statePlugins: StatePlugins;
    globalPlugins: GlobalPlugins;
}
interface WorkflowOptions {
    workflowDefinitionType: 'statechart-json' | 'bpmn-json';
    workflowDefinition: MachineConfig<any, any, any>;
    workflowActions?: MachineOptions<any, any>['actions'];
    context?: WorkflowContext;
    extensions?: WorkflowExtensions;
}
interface WorkflowRunnerArgs {
    workflowDefinition: MachineConfig<any, any, any>;
    workflowActions?: MachineOptions<any, any>['actions'];
    context: any;
    state?: string;
    extensions?: WorkflowExtensions;
}
type WorkflowEventWithoutState = Omit<WorkflowEvent, 'state'>;
type StatePlugins = StatePlugin[];
type GlobalPlugins = GlobalPlugin[];
type TCreateWorkflow = (options: WorkflowOptions) => Workflow;
declare const Error$1: {
    readonly ERROR: "ERROR";
    readonly HTTP_ERROR: "HTTP_ERROR";
};
declare const Errors: readonly ["ERROR", "HTTP_ERROR"];

declare const createWorkflow: TCreateWorkflow;

declare class HttpError extends Error {
    status: number;
    constructor(status: number, message: string, cause?: unknown);
}

export { Error$1 as Error, Errors, HttpError, StatePlugin, WorkflowEvent, WorkflowEventWithoutState, WorkflowOptions, WorkflowRunnerArgs, createWorkflow };
