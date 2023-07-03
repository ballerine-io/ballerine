import { describe, expect, it, test, vi } from 'vitest';
import { createWorkflowClient } from './create-workflow-client';
import { MemoryStore } from './adapters/memory-store';
import { MemoryPersistencePlugin } from './plugins/memory-persistence-plugin';
import {
  ChildWorkflow,
  ChildWorkflowMetadata,
  ParentWorkflowMetadata,
  WorkflowCallbackPayload,
  WorkflowClientOptions,
} from '@ballerine/workflow-core';
import { WorkflowOptionsNode } from './types';

const simpleMachine = {
  id: 'toggle',
  initial: 'inactive',
  context: {},
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } },
  },
};

test('Simple Server Workflow', async () => {
  console.log('Running create Server Workflow');

  const workflow = createWorkflowClient();
  const runner = workflow.createWorkflow({
    definitionType: 'statechart-json',
    definition: simpleMachine,
  });

  expect(runner.getSnapshot().value).toBe('inactive');
  await runner.sendEvent({ type: 'TOGGLE' });
  expect(runner.getSnapshot().value).toBe('active');

  await runner.sendEvent({ type: 'TOGGLE' });
  expect(runner.getSnapshot().value).toBe('inactive');
});

test.skip('Server Workflow persistence MemoryStore', () => {
  const userId = '123456';
  const memoryStore = new MemoryStore();
  const memoryPersistencePlugin = new MemoryPersistencePlugin({
    name: 'in-memory-persistence',
    stateNames: [],
    when: 'post',
    store: memoryStore,
  });

  simpleMachine.context = { ...(simpleMachine.context || {}), entityId: userId };

  const workflow = createWorkflowClient().createWorkflow({
    definitionType: 'statechart-json',
    definition: simpleMachine,
    extensions: {
      statePlugins: [memoryPersistencePlugin],
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
  const restoredWorkflow = createWorkflowClient().createWorkflow({
    definitionType: 'statechart-json',
    definition: simpleMachine,
    workflowContext: { machineContext: workflowData!.context, state: workflowData!.state },
    extensions: {
      statePlugins: [memoryPersistencePlugin],
    },
  });

  restoredWorkflow.sendEvent({ type: 'TOGGLE' });
  expect(restoredWorkflow.getSnapshot().value).toBe('inactive');
});

const parentMachineBase = {
  definitionType: 'statechart-json' as const,
  definition: {
    id: 'parent_machine',
    initial: 'parent_initial',
    context: {},
    states: {
      parent_initial: { on: { NEXT: 'invoke_child' } },
      invoke_child: { on: { NEXT: 'invoked_child' } },
      invoked_child: {
        type: 'final',
      },
    },
  },
  workflowContext: {
    machineContext: {},
  },
} satisfies WorkflowOptionsNode;
const childMachine = {
  definitionType: 'statechart-json' as const,
  definition: {
    id: 'child_machine',
    initial: 'child_initial',
    context: {},
    states: {
      child_initial: { on: { NEXT: 'child_final' } },
      child_final: {
        type: 'final',
      },
    },
  },
} satisfies Omit<WorkflowOptionsNode, 'childWorkflows' | 'onInvokeChildWorkflow' | 'onEvent'>;

describe('Parent and child workflows #integration #featureset', () => {
  describe('when a child workflow is invoked', async () => {
    let response:
      | {
          childWorkflowMetadata: ChildWorkflowMetadata;
          childSnapshot: ReturnType<
            ReturnType<ReturnType<typeof createWorkflowClient>['createWorkflow']>['getSnapshot']
          >;
        }
      | undefined;
    const onInvokeChildWorkflow = vi.fn<
      [Parameters<NonNullable<WorkflowClientOptions['onInvokeChildWorkflow']>>[0]],
      ReturnType<NonNullable<WorkflowClientOptions['onInvokeChildWorkflow']>>
    >(async (childWorkflowMetadata: ChildWorkflowMetadata) => {
      {
        const childWorkflowService = workflowClient.createWorkflow({
          ...childMachine,
          definition: {
            ...childMachine.definition,
            context: childWorkflowMetadata?.initOptions?.context,
          },
          workflowContext: {
            machineContext: childWorkflowMetadata?.initOptions?.context,
          },
        });

        if (childWorkflowMetadata?.initOptions?.event) {
          await childWorkflowService.sendEvent({
            type: childWorkflowMetadata?.initOptions?.event,
          });
        }

        response = {
          childWorkflowMetadata,
          childSnapshot: childWorkflowService.getSnapshot(),
        };

        return {
          endUser: {
            id: 'user_1',
          },
        };
      }
    });

    const onInvokeChildWorkflowTwo = vi.fn<
      [Parameters<NonNullable<WorkflowClientOptions['onInvokeChildWorkflow']>>[0]],
      ReturnType<NonNullable<WorkflowClientOptions['onInvokeChildWorkflow']>>
    >(async childWorkflowMetadata => {
      {
        return;
      }
    });

    const workflowClient = createWorkflowClient({
      // @ts-expect-error - TODO: fix mock type
      onInvokeChildWorkflow,
    });
    const parentWorkflowService = workflowClient.createWorkflow({
      ...parentMachineBase,
      childWorkflows: [
        {
          waitForResolved: true,
          name: 'child_machine_name_1',
          definitionId: 'child_machine_definition_1',
          runtimeId: 'child_machine_runtime_1',
          definitionVersion: 1,
          stateNames: ['invoke_child'],
          // Context to copy from the parent workflow
          contextToCopy: {
            transform: {
              transformer: 'jmespath',
              mapping: '{data: endUser.id}',
            },
          },
          callbackInfo: {
            event: 'parent_initial',
            contextToCopy: {
              transform: {
                transformer: 'jmespath',
                mapping: '{data: endUser.id}',
              },
            },
          },
          initOptions: {
            event: 'NEXT',
            context: {
              endUser: {
                id: 'user_1',
              },
            },
            state: 'child_initial',
          },
        },
      ],
    });

    it('should be invoked once for configured stateNames', async () => {
      await parentWorkflowService.sendEvent({
        type: 'NEXT',
      });

      expect(onInvokeChildWorkflow).toHaveBeenCalledTimes(1);
      onInvokeChildWorkflow.mockClear();
    });

    it("should return the child's workflow metadata", async () => {
      await parentWorkflowService.sendEvent({
        type: 'NEXT',
      });

      expect(response?.childWorkflowMetadata).toStrictEqual({
        name: 'child_machine_name_1',
        definitionId: 'child_machine_definition_1',
        runtimeId: 'child_machine_runtime_1',
        version: 1,
        initOptions: {
          event: 'NEXT',
          context: {
            endUser: {
              id: 'user_1',
            },
          },
          state: 'child_initial',
        },
      } satisfies ChildWorkflowMetadata);
      response = undefined;
      onInvokeChildWorkflow.mockClear();
    });

    it('should only be invoked for configured stateNames', async () => {
      await parentWorkflowService.sendEvent({
        type: 'NEXT',
      });
      await parentWorkflowService.sendEvent({
        type: 'NEXT',
      });

      expect(onInvokeChildWorkflow).toHaveBeenCalledTimes(1);
      expect(parentWorkflowService.getSnapshot().value).toBe('invoked_child');
      onInvokeChildWorkflow.mockClear();
    });

    const workflowClientTwo = createWorkflowClient({
      // @ts-expect-error - TODO: fix mock type
      onInvokeChildWorkflow: onInvokeChildWorkflowTwo,
    });
    const parentWorkflowServiceTwo = workflowClientTwo.createWorkflow({
      ...parentMachineBase,
      childWorkflows: [
        {
          waitForResolved: true,
          name: 'child_machine_name_2',
          definitionId: 'child_machine_definition_2',
          runtimeId: 'child_machine_runtime_2',
          definitionVersion: 1,
          stateNames: ['invoke_child', 'invoked_child'],
          // Context to copy from the parent workflow
          contextToCopy: {
            transform: {
              transformer: 'jmespath',
              mapping: '{data: stakeholders}',
            },
          },
          callbackInfo: {
            event: 'parent_initial',
            contextToCopy: {
              transform: {
                transformer: 'jmespath',
                mapping: '{data: endUser.id}',
              },
            },
          },
          initOptions: {
            event: 'NEXT',
            context: {
              endUser: {
                id: 'user_1',
              },
            },
            state: 'child_initial',
          },
        },
      ],
    });

    it('should be invoked on two or more configured stateNames', async () => {
      await parentWorkflowServiceTwo.sendEvent({
        type: 'NEXT',
      });
      await parentWorkflowServiceTwo.sendEvent({
        type: 'NEXT',
      });

      expect(onInvokeChildWorkflowTwo).toHaveBeenCalledTimes(2);
      expect(parentWorkflowServiceTwo.getSnapshot().value).toBe('invoked_child');
      onInvokeChildWorkflowTwo.mockClear();
    });

    it('should update the context of the parent', async () => {
      await parentWorkflowService.sendEvent({
        type: 'NEXT',
      });

      expect(parentWorkflowService.getSnapshot().context).toStrictEqual({
        childWorkflows: [
          {
            data: {
              endUser: {
                id: 'user_1',
              },
            },
            error: undefined,
          },
        ],
      });
      onInvokeChildWorkflow.mockClear();
    });
  });

  describe('when a child workflow reaches its final state', async () => {
    let response: Parameters<NonNullable<WorkflowClientOptions['onEvent']>>[0] | undefined;
    const onEvent = vi.fn<
      [Parameters<NonNullable<WorkflowClientOptions['onEvent']>>[0]],
      ReturnType<NonNullable<WorkflowClientOptions['onEvent']>>
    >(async payload => {
      response = payload;
    });
    const childWorkflows = [
      {
        waitForResolved: true,
        name: 'child_machine_name_1',
        definitionId: 'child_machine_definition_1',
        runtimeId: 'child_machine_runtime_1',
        definitionVersion: 1,
        stateNames: ['invoke_child'],
        // Context to copy from the parent workflow
        contextToCopy: {
          transform: {
            transformer: 'jmespath',
            mapping: '{data: stakeholders}',
          },
        },
        callbackInfo: {
          event: 'parent_initial',
          contextToCopy: {
            transform: {
              transformer: 'jmespath',
              mapping: '{data: endUser.id}',
            },
          },
        },
        initOptions: {
          event: 'NEXT',
          context: {
            endUser: {
              id: 'user_1',
            },
          },
          state: 'child_initial',
        },
      },
    ] satisfies Array<ChildWorkflow>;

    const workflowClient = createWorkflowClient({
      // @ts-expect-error - TODO: fix mock type
      async onInvokeChildWorkflow(childWorkflowMetadata) {
        const childWorkflow = childWorkflows.find(
          ({ runtimeId }) => runtimeId === childWorkflowMetadata.runtimeId,
        );
        const childWorkflowService = workflowClient.createWorkflow({
          ...childMachine,
          definition: {
            ...childMachine.definition,
            context: {
              ...childWorkflowMetadata?.initOptions?.context,
              childWorkflowMetadata,
              parentWorkflowMetadata: {
                name: 'parent_machine_name_1',
                definitionId: 'parent_machine_definition_1',
                runtimeId: 'parent_machine_runtime_1',
                version: 1,
              } satisfies ParentWorkflowMetadata,
              callbackInfo: childWorkflow?.callbackInfo,
            },
          },
          workflowContext: {
            machineContext: {
              ...childWorkflowMetadata?.initOptions?.context,
              childWorkflowMetadata,
              parentWorkflowMetadata: {
                name: 'parent_machine_name_1',
                definitionId: 'parent_machine_definition_1',
                runtimeId: 'parent_machine_runtime_1',
                version: 1,
              } satisfies ParentWorkflowMetadata,
              callbackInfo: childWorkflow?.callbackInfo,
            },
          },
        });

        await childWorkflowService.sendEvent({
          type: `NEXT`,
        });
        await childWorkflowService.sendEvent({
          type: `NEXT`,
        });
      },
      onEvent,
    });
    const parentWorkflowService = workflowClient.createWorkflow({
      ...parentMachineBase,
      childWorkflows,
    });

    it('should invoke `onEvent`', async () => {
      await parentWorkflowService.sendEvent({
        type: 'NEXT',
      });
      await parentWorkflowService.sendEvent({
        type: 'NEXT',
      });

      expect(onEvent).toHaveBeenCalledTimes(1);
      onEvent.mockClear();
    });

    it('should pass the expected payload to `onEvent`', async () => {
      await parentWorkflowService.sendEvent({
        type: 'NEXT',
      });
      await parentWorkflowService.sendEvent({
        type: 'NEXT',
      });

      expect(response).toStrictEqual({
        parentWorkflowMetadata: {
          name: 'parent_machine_name_1',
          definitionId: 'parent_machine_definition_1',
          runtimeId: 'parent_machine_runtime_1',
          version: 1,
        },
        childWorkflowMetadata: {
          name: 'child_machine_name_1',
          definitionId: 'child_machine_definition_1',
          runtimeId: 'child_machine_runtime_1',
          version: 1,
          initOptions: {
            context: {
              endUser: {
                id: 'user_1',
              },
            },
            event: 'NEXT',
            state: 'child_initial',
          },
        },
        callbackInfo: {
          event: 'parent_initial',
          contextToCopy: {
            transform: {
              transformer: 'jmespath',
              mapping: '{data: endUser.id}',
            },
          },
        },
      } satisfies WorkflowCallbackPayload);
      onEvent.mockClear();
    });
  });
});
