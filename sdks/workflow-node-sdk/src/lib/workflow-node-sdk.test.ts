import { expect, test } from 'vitest';
import { createWorkflow } from './create-workflow';
import { MemoryStore } from './adapters/memory-store';
import { MemoryPersistencePlugin } from './plugins/memory-persistence-plugin';

const simpleMachine = {
  id: 'toggle',
  initial: 'inactive',
  context: {},
  states: {
    inactive: { on: { TOGGLE: 'active' } },
    active: { on: { TOGGLE: 'inactive' } },
  },
};

test('Simple Server Workflow', () => {
  console.log('Running create Server Workflow');

  const workflow = createWorkflow({
    definitionType: 'statechart-json',
    definition: simpleMachine,
  });
  const runner = workflow;
  expect(runner.getSnapshot().value).toBe('inactive');
  runner.sendEvent({ type: 'TOGGLE' });
  expect(runner.getSnapshot().value).toBe('active');

  runner.sendEvent({ type: 'TOGGLE' });
  expect(runner.getSnapshot().value).toBe('inactive');
});
