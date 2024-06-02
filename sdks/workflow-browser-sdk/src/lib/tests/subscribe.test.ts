import { uniqueArray } from '@ballerine/common';
import { HttpError } from '@ballerine/workflow-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WorkflowBrowserSDK } from '../workflow-browser-sdk';
import { errorWorkflow, workflowOptions } from './workflow-options';

let workflowService: WorkflowBrowserSDK;
let events: any[] = [];

const next = async (payload?: Record<PropertyKey, any>) => {
  await workflowService?.sendEvent({
    type: 'USER_NEXT_STEP',
    payload,
  });
};

const prev = async (payload?: Record<PropertyKey, any>) => {
  await workflowService?.sendEvent({
    type: 'USER_PREV_STEP',
    payload,
  });
};

const breakLocalStorage = () => {
  const localStorage = vi.fn(() => ({
    getItem: () => {
      throw new Error('localStorage is not available');
    },
  }));

  vi.stubGlobal('localStorage', localStorage);
};

beforeEach(() => {
  workflowService = new WorkflowBrowserSDK(workflowOptions);
  events = [];
});

describe('subscribe', () => {
  it('should subscribe to USER_NEXT_STEP events', async () => {
    workflowService?.subscribe('USER_NEXT_STEP', event => events.push(event));

    await next();

    expect(events).to.have.lengthOf(1);
    expect(events[0]).toMatchObject({ state: 'second' });

    await next();

    expect(events).to.have.lengthOf(2);
    expect(events[1]).toMatchObject({ state: 'third' });
  });

  it('should subscribe to USER_PREV_STEP events', async () => {
    workflowService.subscribe('USER_PREV_STEP', event => events.push(event));

    await next();
    await prev();

    expect(events).to.have.lengthOf(1);
    expect(events[0]).toMatchObject({ state: 'first' });
  });

  it.skip('should subscribe to WILD_CARD events', async () => {
    breakLocalStorage();

    workflowService = new WorkflowBrowserSDK(errorWorkflow);

    workflowService.subscribe('*', event => events.push(event));

    await next();
    await prev();
    await next();

    const types = uniqueArray(events.map(({ type }: { type: string }) => type)).sort();
    const expectedTypes = [
      'STATE_ACTION_STATUS',
      'USER_NEXT_STEP',
      'USER_PREV_STEP',
      'HTTP_ERROR',
      'ERROR',
    ].sort();

    expect(types).to.deep.equal(expectedTypes);
  });

  it.skip('should subscribe to ERROR events', async () => {
    breakLocalStorage();

    workflowService = new WorkflowBrowserSDK(errorWorkflow);

    workflowService.subscribe('ERROR', event => events.push(event));

    await next();

    expect(events).to.have.lengthOf(2);

    const httpError = events.find(({ type }: { type: string }) => type === 'HTTP_ERROR');
    const unexpectedError = events.find(({ type }: { type: string }) => type === 'ERROR');

    expect(httpError.error).to.be.instanceOf(HttpError);
    expect(unexpectedError.error).to.be.instanceOf(Error);
  });

  it.skip('should subscribe to HTTP_ERROR events', async () => {
    workflowService = new WorkflowBrowserSDK(errorWorkflow);

    workflowService.subscribe('HTTP_ERROR', event => events.push(event));

    await next();

    expect(events).to.have.lengthOf(1);
    expect(events[0]).to.not.have.property('type');
    expect(events[0].error).toBeInstanceOf(HttpError);
  });

  it('should subscribe to user defined events', async () => {
    workflowService = new WorkflowBrowserSDK({
      runtimeId: '',
      definitionType: 'statechart-json',
      definition: {
        id: 'test',
        initial: 'first',
        states: {
          first: {
            on: {
              custom: 'last',
            },
          },
          last: {},
        },
      },
    });

    workflowService.subscribe('custom' as never, ((event: any) => events.push(event)) as never);

    await workflowService.sendEvent({
      type: 'custom',
      payload: {
        foo: 'bar',
      },
    });

    expect(events).to.have.lengthOf(1);
    expect(events[0]).toMatchObject({
      state: 'last',
      payload: {
        foo: 'bar',
      },
    });
  });
});
