import type { StateMachine } from 'xstate';
import type { WorkflowEvent, WorkflowEventWithoutState, WorkflowRunnerArgs } from './types';
export declare class WorkflowRunner {
    #private;
    get workflow(): StateMachine<any, any, any, {
        value: any;
        context: any;
    }, import("xstate").BaseActionObject, import("xstate").ServiceMap, import("xstate").ResolveTypegenMeta<import("xstate").TypegenDisabled, any, import("xstate").BaseActionObject, import("xstate").ServiceMap>>;
    get state(): any;
    constructor({ workflowDefinition, workflowActions, context, state, extensions }: WorkflowRunnerArgs, debugMode?: boolean);
    sendEvent(event: WorkflowEventWithoutState): Promise<void>;
    subscribe(callback: (event: WorkflowEvent) => void): void;
    getSnapshot(): import("xstate").State<any, any, any, {
        value: any;
        context: any;
    }, import("xstate").ResolveTypegenMeta<import("xstate").TypegenDisabled, any, import("xstate").BaseActionObject, import("xstate").ServiceMap>>;
}
