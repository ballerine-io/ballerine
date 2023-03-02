import { describe, expect, it } from 'vitest';
import { sleep } from '../utils';
import { WorkflowBrowserSDK } from './workflow-browser-sdk';

const options: ConstructorParameters<typeof WorkflowBrowserSDK>[0] = {
  backend: {
    baseUrl: '',
  },
  workflowDefinitionType: 'statechart-json',
  workflowDefinition: {
    id: 'test',
    initial: 'start',
    states: {
      start: {
        on: {
          USER_NEXT_STEP: 'mid',
        },
      },
      mid: {
        on: {
          USER_PREV_STEP: 'start',
          USER_NEXT_STEP: 'end',
        },
      },
      end: {
        type: 'final',
      },
      alt: {
        type: 'final',
      },
    },
  },
  submitStates: [
    {
      state: 'mid',
    },
  ],
  persistStates: [
    {
      state: 'alt',
      persistence: 'LOCAL_STORAGE',
    },
  ],
};

describe('WorkflowBrowserSDK', () => {
  it('should create a workflow service', () => {
    const workflowService = new WorkflowBrowserSDK(options);

    expect(workflowService).to.be.instanceOf(WorkflowBrowserSDK);
    expect(workflowService.getSnapshot()).to.have.property('value', 'start');
  });

  it('should inject the USER_NEXT_STEP and USER_PREV_STEP actions', () => {
    const workflowService = new WorkflowBrowserSDK(options);
    const machine = workflowService.getSnapshot().machine;
    const actions = machine.options.actions;

    // USER_PREV_STEP
    expect(actions).to.have.property('USER_PREV_STEP');
    expect(actions.USER_PREV_STEP).to.have.property('type', 'xstate.assign');
    expect(machine.states.mid.config.on.USER_PREV_STEP).toMatchObject({
      target: 'start',
      actions: ['USER_PREV_STEP'],
    });

    // USER_NEXT_STEP
    expect(actions).to.have.property('USER_NEXT_STEP');
    expect(actions.USER_NEXT_STEP).to.have.property('type', 'xstate.assign');
    expect(machine.states.mid.config.on.USER_NEXT_STEP).toMatchObject({
      target: 'end',
      actions: ['USER_NEXT_STEP'],
    });
  });

  it('should inject plugins', () => {
    let workflowService = new WorkflowBrowserSDK({
      ...options,
      submitStates: [],
    });
    let machine = workflowService.getSnapshot().machine;

    // Submit plugin falls back to states with type: 'final'
    expect(machine.states.end.onEntry[1]).toMatchObject({
      type: 'SUBMIT_BACKEND',
      exec: undefined,
    });

    // Injects user defined submitStates
    workflowService = new WorkflowBrowserSDK(options);
    machine = workflowService.getSnapshot().machine;

    expect(machine.states.mid.onEntry[1]).toMatchObject({
      type: 'SUBMIT_BACKEND',
      exec: undefined,
    });

    // Injects user defined persistStates
    expect(machine.states.alt.onEntry[1]).toMatchObject({
      type: 'SYNC_LOCAL_STORAGE',
      exec: undefined,
    });
  });

  it('should subscribe to USER_NEXT_STEP events', () => {
    const workflowService = new WorkflowBrowserSDK(options);
    const events: any[] = [];

    workflowService.subscribe('USER_NEXT_STEP', event => events.push(event));

    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
    });

    expect(events).to.have.lengthOf(1);
    expect(events[0]).toMatchObject({ state: 'mid' });

    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
    });

    expect(events).to.have.lengthOf(2);
    expect(events[1]).toMatchObject({ state: 'end' });
  });

  it('should subscribe to USER_PREV_STEP events', () => {
    const workflowService = new WorkflowBrowserSDK(options);
    const events: any[] = [];

    workflowService.subscribe('USER_PREV_STEP', event => events.push(event));

    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
    });
    workflowService.sendEvent({
      type: 'USER_PREV_STEP',
    });

    expect(events).to.have.lengthOf(1);
    expect(events[0]).toMatchObject({ state: 'start' });
  });

  it('should subscribe to WILD_CARD events', async () => {
    const workflowService = new WorkflowBrowserSDK(options);
    const events: any[] = [];

    workflowService.subscribe('*', event => events.push(event));

    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
    });
    workflowService.sendEvent({
      type: 'USER_PREV_STEP',
    });

    // Wait for the http request to finish
    await sleep(300);

    expect(events).to.have.lengthOf(5);
    expect(events[0]).to.have.property('type', 'STATE_ACTION_STATUS');
    expect(events[1]).to.have.property('type', 'USER_NEXT_STEP');
    expect(events[2]).to.have.property('type', 'USER_PREV_STEP');
    expect(events[4]).to.have.property('type', 'ERROR');
  });

  it('should subscribe to ERROR events', async () => {
    const workflowService = new WorkflowBrowserSDK({
      workflowDefinitionType: 'statechart-json',
      workflowDefinition: {
        id: 'test',
        initial: 'start',
        states: {
          start: {
            on: {
              USER_NEXT_STEP: 'mid',
            },
          },
          mid: {},
        },
      },
      persistStates: [
        {
          state: 'mid',
          persistence: 'LOCAL_STORAGE',
        },
      ],
    });
    const events: any[] = [];

    workflowService.subscribe('ERROR', event => events.push(event));

    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
    });

    await sleep(300);

    expect(events).to.have.lengthOf(1);
    expect(events[0]).to.have.property('type', 'ERROR');
    expect(events[0]).to.have.property('error');
    console.log(events[0]);
  });

  it.todo('should subscribe to HTTP_ERROR events', () => {
    const workflowService = new WorkflowBrowserSDK(options);
  });

  it('should subscribe to user defined events', () => {
    const workflowService = new WorkflowBrowserSDK({
      backend: {
        baseUrl: '',
      },
      workflowDefinitionType: 'statechart-json',
      workflowDefinition: {
        id: 'test',
        initial: 'start',
        states: {
          start: {
            on: {
              custom: {
                target: 'end',
              },
            },
          },
          end: {},
        },
      },
    });
    const events: any[] = [];

    workflowService.subscribe('custom', event => events.push(event));

    workflowService.sendEvent({
      type: 'custom',
      payload: {
        foo: 'bar',
      },
    });

    expect(events).to.have.lengthOf(1);
    expect(events[0]).toMatchObject({
      state: 'end',
      payload: {
        foo: 'bar',
      },
    });
  });

  it('should update context on USER_PREV_STEP and USER_NEXT_STEP', () => {
    // Does not result in ['document1', 'document1']
    const workflowService = new WorkflowBrowserSDK(options);

    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
      payload: {
        documents: ['document1'],
      },
    });

    expect(workflowService.getSnapshot().context.documents).toStrictEqual(['document1']);

    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
      payload: {
        documents: ['document1'],
      },
    });

    expect(workflowService.getSnapshot().context.documents).toStrictEqual(['document1']);

    // Allows partial updates
    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
      payload: {
        documents: [...workflowService.getSnapshot().context.documents, 'document2'],
      },
    });

    expect(workflowService.getSnapshot().context.documents).toStrictEqual([
      'document1',
      'document2',
    ]);

    // Does not touch unrelated context
    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
      payload: {
        email: 'john@doe.com',
      },
    });

    expect(workflowService.getSnapshot().context).toMatchObject({
      documents: ['document1', 'document2'],
      email: 'john@doe.com',
    });
  });

  it.todo('should fire an HTTP request using the backend config', () => {
    const workflowService = new WorkflowBrowserSDK(options);
    const events: any[] = [];

    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
    });

    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
    });
  });
});
