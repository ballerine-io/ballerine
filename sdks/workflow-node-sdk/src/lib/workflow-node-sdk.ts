import { createWorkflow } from '@ballerine/workflow-core';
import { TCreateWorkflowCoreReturn, WorkflowOptionsNode } from './types';
import { version } from 'prettier';
import { initEvent } from 'xstate/lib/actions';

// NOW
const wokrflowRunner = new WorkflowNodeSDK({})
// Following is the strcture of an invokeChildWorkflow event
parentWorkflowMetadata: {
  name
  defintionId
  runtimeId
  version
}
childWorkflowMetadata: {
  name
  defintionId
  runtimeId
  version
  initOptions?: {
    // static data to initate the new machine with
    context: Object;
    state: string;
    event: string;
  }
}
callbackInfo: {
  event,
  // what data should be sent back to the parent workflow, out of the full child workflow context
  contextToCopy: {
    user: {
      idvResult: true
    }
  }
}
 wokrflowRunner.subscribe('invokeChildWorkflow', ({parentWorkflowMetadata ,childWorkflowMetadata,callbackInfo}) => { insertRuntimeData({parentWorkflowMetadata ,childWorkflowMetadata,callbackInfo})

// The host should listen to the event and do the following:
// insert a workflow runtime data w/ the relevant context
// update the partent mahcine context with the new child machine runtime id



// Child wokrflow
// Context:
// { _metadata: { parentWorkflow: { id: 'runtimeId', callbackEvent, callbackContext} }, ...context }


// Parent workflow
// Context:
// { _metadata: { childWorkflows: [{ workflowDefinition: 'KYC',runtimeId: id, initiatingState, status: 'done', doneContext: { KYCResult: 'approved' } }], ...context} 


// Parent Workflow - KYB ()
// Take holders (email)
// Process KYCs
  // Omri (KYC - Child Workflow)
  // Alon (KYC - Child Workflow)
  // Yoni (KYC "")
  // Yael (KYC "")

// Approve businsess - (if all done and they are all approved) -> transition to next state


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
