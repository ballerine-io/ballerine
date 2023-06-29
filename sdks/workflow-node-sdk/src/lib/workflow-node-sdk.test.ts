import { describe, expect, it, test } from 'vitest';
import { createWorkflowClient } from './create-workflow-client';
import { MemoryStore } from './adapters/memory-store';
import { MemoryPersistencePlugin } from './plugins/memory-persistence-plugin';
import { ChildWorkflowMetadata } from '@ballerine/workflow-core';

const simpleMachine = {
  id: 'toggle',
  initial: 'inactive',
  context: {},
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } },
  },
};

test('Simple Server Workflow', t => {
  console.log('Running create Server Workflow');

  const workflow = createWorkflowClient({
    async onEvent(payload) {
      console.log('onEvent', payload);
    },
    async onInvokeChildWorkflow(payload) {
      console.log('onInvokeChildWorkflow', payload);
    },
  });
  const runner = workflow.createWorkflow({
    definitionType: 'statechart-json',
    definition: simpleMachine,
  });

  expect(runner.getSnapshot().value).toBe('inactive');
  runner.sendEvent({ type: 'TOGGLE' });
  expect(runner.getSnapshot().value).toBe('active');

  runner.sendEvent({ type: 'TOGGLE' });
  expect(runner.getSnapshot().value).toBe('inactive');
});

test.skip('Server Workflow persistance MemoryStore', () => {
  const userId = '123456';
  const memoryStore = new MemoryStore();
  const memoryPersistancePlugin = new MemoryPersistencePlugin({
    name: 'in-memory-persistance',
    stateNames: [],
    when: 'post',
    store: memoryStore,
  });

  simpleMachine.context = { ...(simpleMachine.context || {}), entityId: userId };

  const workflow = createWorkflowClient().createWorkflow({
    definitionType: 'statechart-json',
    definition: simpleMachine,
    extensions: {
      statePlugins: [memoryPersistancePlugin],
    },
  });

  expect(workflow.getSnapshot().value).toBe('inactive');
  workflow.sendEvent({ type: 'TOGGLE' });
  expect(workflow.getSnapshot().value).toBe('active');

  const userWorkflows = memoryStore.find(userId);
  expect(userWorkflows.length).toBe(1);

  const workflowId = userWorkflows[0]!;
  let workflowData = memoryStore.get(workflowId, userId);

  expect(workflowData).toBeTruthy();

  console.log(workflowData);
  const restoredWorkflow = createWorkflowClient({
    async onEvent(payload) {
      console.log('onEvent', payload);
    },
    async onInvokeChildWorkflow(payload) {
      console.log('onInvokeChildWorkflow', payload);
    },
  }).createWorkflow({
    definitionType: 'statechart-json',
    definition: simpleMachine,
    workflowContext: { machineContext: workflowData!.context, state: workflowData!.state },
    extensions: {
      statePlugins: [memoryPersistancePlugin],
    },
  });

  restoredWorkflow.sendEvent({ type: 'TOGGLE' });
  expect(restoredWorkflow.getSnapshot().value).toBe('inactive');
});

const parentMachine = {
  definitionType: 'statechart-json' as const,
  definition: {
    id: 'parent_machine',
    initial: 'parent_initial',
    context: {},
    states: {
      parent_initial: { on: { NEXT: 'invoke_child' } },
      invoke_child: { on: { NEXT: 'parent_initial' } },
    },
  },
  childWorkflows: [
    {
      definitionId: 'child_machine',
      definitionVersion: 1,
      stateNames: ['invoke_child'],
      // Context to copy from the parent workflow
      contextToCopy: {
        stakeholders: true,
      },
      callbackInfo: {
        event: 'parent_initial',
        contextToCopy: {
          endUser: {
            id: true,
          },
        },
      },
      initOptions: {
        // event: 'kyc',
        context: {
          type: 'kyb_child',
        },
        // state: 'send_communications',
      },
    },
  ],
  workflowContext: {
    machineContext: {},
  },
};
const childMachine = {
  definitionType: 'statechart-json' as const,
  definition: {
    id: 'child_machine',
    initial: 'child_initial',
    context: {},
    states: {
      child_initial: { on: { NEXT: 'child_final' } },
      child_final: { on: { NEXT: 'child_initial' } },
    },
  },
};

describe('Parent and child workflows #integration #featureset', () => {
  let response: {
    childWorkflowMetadata: ChildWorkflowMetadata;
    snapshot: ReturnType<
      ReturnType<ReturnType<typeof createWorkflowClient>['createWorkflow']>['getSnapshot']
    >;
  };

  const workflowClient = createWorkflowClient({
    async onInvokeChildWorkflow(childWorkflowMetadata) {
      const service = workflowClient.createWorkflow({
        ...childMachine,
        definition: {
          ...childMachine.definition,
          context: childWorkflowMetadata.initOptions?.context,
        },
        workflowContext: {
          machineContext: childWorkflowMetadata.initOptions?.context,
        },
      });

      if (childWorkflowMetadata?.initOptions?.event) {
        await service.sendEvent({
          type: childWorkflowMetadata?.initOptions?.event,
        });
      }

      response = {
        childWorkflowMetadata,
        snapshot: service.getSnapshot(),
      };
    },
  });
  const parentWorkflow = workflowClient.createWorkflow(parentMachine);

  describe('when a child workflow is invoked', async () => {
    await parentWorkflow.sendEvent({
      type: 'NEXT',
    });

    it('should return the child workflow definition id', () => {
      console.log({ response });
      expect(response.childWorkflowMetadata.definitionId).toBe('child_machine');
    });
  });
});
