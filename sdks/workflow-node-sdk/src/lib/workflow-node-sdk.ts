import { createWorkflow } from '@ballerine/workflow-core';
import { TCreateWorkflowCoreReturn, WorkflowOptionsNode } from './types';

// NOW
const wokrflow = new WorkflowNodeSDK({definition,context})
// this happend on each workflow init
workflow.subscribe('invokeWorkflow', workflowDefID, workflowVersion, workflowContext, callbackEvent, callbackContext)

// Suggestion
const wokrflowRunner = new WorkflowNodeSDK(options)
wokrflowRunner.subscribe('invokeWorkflow', workflowDefID, workflowVersion, workflowContext, callbackEvent, callbackContext)

wokrflowRunner.createWorkflow(...)
wokrflowRunner.createWorkflow(...)
wokrflowRunner.createWorkflow(...).subscribe

// Child workflow context, on invoke
// should be pre-added in contextToCopy
const context = {
  parentWrofklow: {
    runtimeId,
     callbackEvent,
     // Data from the context we should attach to the callback event
      callbackContext:
      
  }
};


//{ parentMachine: '#runtimeID', event: 'Next', dataFromContext: { userData: { state: true } } }




export class WorkflowNodeSDK {
  #__service: TCreateWorkflowCoreReturn;

  constructor(options: WorkflowOptionsNode) {
    const { invokeWorkflow } = options;
    if () {
      // here we should inject a plugin/action that will invoke child workflows
      // The plugin should be able to expose events to the host saying which child workflow should be invoked
      throw new Error('childWorkflows not supported in Node SDK');
    }
    this.#__service = createWorkflow({ definition, definitionType, extensions, workflowContext });
  }

  // this part should change to the way the browser sdk works (event based)
  // the workflow service (host) should be able to listen to "ChildWorkflowInvoked" events
  // and insert create the runtime instance of the child workflow
  // subscribe(callback: Parameters<TCreateWorkflowCoreReturn['subscribe']>[0]) {
  //   this.#__service.subscribe(callback);
  // }
  subscribe(callback: Parameters<TCreateWorkflowCoreReturn['subscribe']>[0]) {
    'invokeWorkflow', workflowDefID..
  }

  // sendEvent(event: Parameters<TCreateWorkflowCoreReturn['sendEvent']>[0]) {
  //   this.#__service.sendEvent(event);
  // }

  // getSnapshot() {
  //   return this.#__service.getSnapshot();
  // }

  createWorkflow({ definition, definitionType, extensions, workflowContext }: WorkflowOptionsNode) {
    const service = createWorkflow({ definition, definitionType, extensions, workflowContext });

    return {
      sendEvent: (event: Parameters<TCreateWorkflowCoreReturn['sendEvent']>[0]) => {
        service.sendEvent(event);
      },
      subscribe: (callback: Parameters<TCreateWorkflowCoreReturn['subscribe']>[0]) => {
        service.subscribe(callback);
      },
      getSnapshot: () => {
        return service.getSnapshot();
      },
    };
  }
}
