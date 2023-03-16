import type { MachineConfig } from 'xstate';
import { expect, test } from 'vitest';
import { WorkflowRunner } from './workflow-runner';

test('restore workflow test', () => {
  const userId = '123456';

  const simpleMachine: MachineConfig<any, any, any> = {
    id: 'toggle',
    initial: 'inactive',
    states: {
      inactive: { on: { TOGGLE: 'active' } },
      active: { on: { TOGGLE: 'inactive' } },
    },
  };

  const service = new WorkflowRunner({
    definition: simpleMachine,
    workflowContext: {
      machineContext: {
        entityId: userId,
      },
    },
    extensions: {
      statePlugins: [],
    },
  });

  expect(service.state).toBe('inactive');
  service.sendEvent({ type: 'TOGGLE' });
  expect(service.state).toBe('active');
  service.sendEvent({ type: 'TOGGLE' });
  expect(service.state).toBe('inactive');
});
