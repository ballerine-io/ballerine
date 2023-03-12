import { expect, test } from 'vitest';
import { createNodeWorkflow, NodeWorkflow } from './nodeWorkflow';
import { initNodeWorkflow } from 'src';
import { MemoryStore } from './adapters/memory-store';
import { MemoryPersistancePlugin } from './plugins/memory-persistance';

const simpleMachine = {
  id: 'toggle',
  initial: 'inactive',
  context: {},
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } },
  },
};


test('Simple Server Workflow', (t) => {
  console.log('Running create Server Workflow');


  const workflow = initNodeWorkflow({ WorkflowDefType: 'bpmn-json', workflowDefinition: simpleMachine, extensions: [] });
  const runner = workflow.runner;
  expect(runner.getSnapshot().value).toBe('inactive');
  runner.sendEvent({ type: 'TOGGLE' })
  expect(runner.getSnapshot().value).toBe('active');


  runner.sendEvent({ type: 'TOGGLE' })
  expect(runner.getSnapshot().value).toBe('inactive');

});

test('Server Workflow persistance MemoryStore', (t) => {
  console.log('Server Workflow persistance MemoryStore');

  const userId = '123456';
  const memoryStore = new MemoryStore();
  const memoryPersistancePlugin = new MemoryPersistancePlugin({ name: 'in-memory-persistance', stateNames: [], when: 'post', store: memoryStore});

  simpleMachine.context = { ...simpleMachine.context || {}, entityId: userId };

  // Create workflow, send an events and verify state transition
  // Runner is loaded with a memory persistance plugin
  // that saves 'post' transition the memory state of the running workflow

  const workflow = initNodeWorkflow({
    WorkflowDefType: 'bpmn-json',
    workflowDefinition: simpleMachine,
    extensions: [memoryPersistancePlugin]
  });


  expect(workflow.runner.getSnapshot().value).toBe('inactive');
  workflow.runner.sendEvent({ type: 'TOGGLE' });
  expect(workflow.runner.getSnapshot().value).toBe('active');


  // check memory store, verify it contains the user workflow runtime data
  const userWorkflows = memoryStore.find(userId)
  expect(userWorkflows.length).toBe(1);

  const workflowId = userWorkflows[0]!
  let workflowData = memoryStore.get(workflowId, userId);

  expect(workflowData).toBeTruthy();

  // create a new workflow runner, load into it the context and set state.

  console.log(workflowData);
  const restoredWorkflow = initNodeWorkflow({
    WorkflowDefType: 'bpmn-json',
    workflowDefinition: simpleMachine,
    context: {machineContext: workflowData!.context, state: workflowData!.state},
    extensions: [memoryPersistancePlugin]
  });

  restoredWorkflow.runner.sendEvent({ type: 'TOGGLE' })
  expect(restoredWorkflow.runner.getSnapshot().value).toBe('inactive');

});


// test('Server Workflow with logic', (t) => {
//   console.log('Running create Server Workflow');
// });

// test('Server Workflow with plugins', (t) => {
//   console.log('Running create Server Workflow');
// });


// test('Server Workflow with locking (Workflow scope)', (t) => {
//   console.log('Running create Server Workflow');
// });


// test('Server Workflow with locking (User scope)', (t) => {
//   console.log('Running create Server Workflow');
// });


