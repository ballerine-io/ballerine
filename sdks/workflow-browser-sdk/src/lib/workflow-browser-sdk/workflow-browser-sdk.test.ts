import { describe, expect, it } from 'vitest';
import { WorkflowBrowserSDK } from './workflow-browser-sdk';

const options: ConstructorParameters<typeof WorkflowBrowserSDK>[0] = {
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

  it.todo('should inject the USER_NEXT_STEP and USER_PREV_STEP actions', () => {
    const workflowService = new WorkflowBrowserSDK(options);
  });

  it.todo('should inject plugins', () => {
    const workflowService = new WorkflowBrowserSDK(options);
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

  it('should subscribe to WILD_CARD events', () => {
    const workflowService = new WorkflowBrowserSDK(options);
    const events: any[] = [];

    workflowService.subscribe('*', event => events.push(event));

    workflowService.sendEvent({
      type: 'USER_NEXT_STEP',
    });
    workflowService.sendEvent({
      type: 'USER_PREV_STEP',
    });

    // TODO: STATE_ACTION_STATUS should also emit error/http error on error
    expect(events).to.have.lengthOf(3);
    expect(events[0]).to.have.property('type', 'STATE_ACTION_STATUS');
    expect(events[1]).to.have.property('type', 'USER_NEXT_STEP');
    expect(events[2]).to.have.property('type', 'USER_PREV_STEP');
  });

  it.todo('should subscribe to ERROR events', () => {
    const workflowService = new WorkflowBrowserSDK(options);
  });

  it.todo('should subscribe to HTTP_ERROR events', () => {
    const workflowService = new WorkflowBrowserSDK(options);
  });

  it.todo('should subscribe to user defined events', () => {
    const workflowService = new WorkflowBrowserSDK(options);
  });
});
