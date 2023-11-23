import { beforeEach, describe, expect, it, test } from 'vitest';
import { WorkflowBrowserSDK } from '../workflow-browser-sdk';
import { workflowOptions } from './workflow-options';

let workflowService: WorkflowBrowserSDK;
let machine: any;
let actions: any;

beforeEach(() => {
  workflowService = new WorkflowBrowserSDK(workflowOptions);
  machine = workflowService.getSnapshot().machine;
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

  test.skip('should inject plugins', () => {
    workflowService = new WorkflowBrowserSDK({
      ...workflowOptions,
      submitStates: [],
    });
    machine = workflowService.getSnapshot().machine;

    // Submit plugin falls back to states with type: 'final'
    expect(
      machine.states.last.onEntry.find(({ type }: { type: string }) => type === 'SUBMIT_BACKEND'),
    ).toMatchObject({
      type: 'SUBMIT_BACKEND',
      exec: undefined,
    });

    // Injects user defined submitStates
    workflowService = new WorkflowBrowserSDK(workflowOptions);
    machine = workflowService.getSnapshot().machine;

    expect(
      machine.states.fourth.onEntry?.find(
        ({ type }: { type: string }) => type === 'SUBMIT_BACKEND',
      ),
    ).toMatchObject({
      type: 'SUBMIT_BACKEND',
      exec: undefined,
    });

    // Injects user defined persistStates
    expect(
      machine.states.third.onEntry?.find(
        ({ type }: { type: string }) => type === 'SYNC_LOCAL_STORAGE',
      ),
    ).toMatchObject({
      type: 'SYNC_LOCAL_STORAGE',
      exec: undefined,
    });
  });
});
