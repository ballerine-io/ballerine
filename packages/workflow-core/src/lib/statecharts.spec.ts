import { MachineConfig } from 'xstate';
import { expect, test } from 'vitest';
import { WorkflowRunner } from './statecharts';

test('Basic machine sanity test', () => {
  const simpleMachine: MachineConfig<any, any, any> = {
    id: 'toggle',
    initial: 'inactive',
    states: {
      inactive: { on: { TOGGLE: 'active' } },
      active: { on: { TOGGLE: 'inactive' } },
    },
  };
  const service = new WorkflowRunner({
    workflowDefinition: simpleMachine,
    context: {},
  });
  expect(service.state).toBe('inactive');
  service.sendEvent({ type: 'TOGGLE' }); // from welcome to intro
  expect(service.state).toBe('active');
  service.sendEvent({ type: 'TOGGLE' }); // from intro to take picture
  expect(service.state).toBe('inactive');
});

test('Basic workflow sanity test', async () => {
  const simpleWorkflow: MachineConfig<any, any, any> = {
    id: 'toggle',
    initial: 'inactive',
    states: {
      inactive: { on: { TOGGLE: 'active' } },
      active: { on: { TOGGLE: 'inactive' } },
    },
  };
  const service = new WorkflowRunner({
    workflowDefinition: simpleWorkflow,
    context: {},
    extensions: {
      statePlugins: [
        {
          stateNames: ['active'],
          when: 'exit',
          // import: '@ballerine/plugins/core/validate@0.2.34',
          // import: '@ballerine/plugins/browser/validate@0.2.34',
          // import: '@ballerine/plugins/node/validate@0.2.34',
          action: ({context, event, currentState}) => {
            console.log('state pre action');
            return Promise.resolve();
          },
        },
        {
          stateNames: ['inactive'],
          when: 'exit',
          action: ({context, event, currentState}) => {
            console.log('state post action');
            return Promise.resolve();
          },
        },
      ],
      globalPlugins: [
        {
          when: 'pre',
          // import: '@ballerine/plugins/core/validate@0.2.34',
          // import: '@ballerine/plugins/browser/validate@0.2.34',
          // import: '@ballerine/plugins/node/validate@0.2.34',
          action: ({context, event, currentState}) => {
            console.log('global pre action');
            return Promise.resolve();
          },
        },
        {
          when: 'post',
          action: ({context, event, currentState}) => {
            console.log('global post action');
            return Promise.resolve();
          },
        },
      ],
    },
  });
  expect(service.state).toBe('inactive');
  await service.sendEvent({ type: 'TOGGLE' }); // from welcome to intro
  expect(service.state).toBe('active');
  await service.sendEvent({ type: 'TOGGLE' }); // from intro to take picture
  expect(service.state).toBe('inactive');
});
