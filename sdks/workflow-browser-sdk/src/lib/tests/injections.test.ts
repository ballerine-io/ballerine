/* eslint-disable */
import { beforeEach, describe, expect, it } from 'vitest';
import { WorkflowBrowserSDK } from '../workflow-browser-sdk';
import { workflowOptions } from './workflow-options';

let workflowService: WorkflowBrowserSDK;
let machine: any;
let actions: any;

beforeEach(() => {
  workflowService = new WorkflowBrowserSDK(workflowOptions);
  machine = workflowService?.getSnapshot().machine;
  actions = machine.options.actions;
});

describe('injections', () => {
  it('should inject the USER_PREV_STEP actions', () => {
    expect(actions.USER_PREV_STEP).to.have.property('type', 'xstate.assign');
    expect(machine.states.second.config.on.USER_PREV_STEP).toMatchObject({
      target: 'first',
      actions: ['USER_PREV_STEP'],
    });
  });

  it('should inject the USER_NEXT_STEP actions', () => {
    expect(actions.USER_NEXT_STEP).to.have.property('type', 'xstate.assign');
    expect(machine.states.second.config.on.USER_NEXT_STEP).toMatchObject({
      target: 'third',
      actions: ['USER_NEXT_STEP'],
    });
  });
});
