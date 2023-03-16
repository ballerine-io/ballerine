import { sleep, uniqueArray } from '@ballerine/common';
import { HttpError } from '@ballerine/workflow-core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WorkflowBrowserSDK } from '../workflow-browser-sdk';
import { errorWorkflow, workflowOptions } from './workflow-options';

let workflowService: WorkflowBrowserSDK;
let events: any[] = [];
let state: string;

const next = (payload?: Record<PropertyKey, any>) => {
  workflowService?.sendEvent({
    type: 'USER_NEXT_STEP',
    payload,
  });
  state = workflowService.getSnapshot().value as string;
};
const prev = (payload?: Record<PropertyKey, any>) => {
  workflowService?.sendEvent({
    type: 'USER_PREV_STEP',
    payload,
  });
  state = workflowService.getSnapshot().value as string;
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
  state = workflowService.getSnapshot().value as string;
});

describe('subscribe', () => {
  it('should subscribe to USER_NEXT_STEP events', () => {
    workflowService?.subscribe('USER_NEXT_STEP', event => events.push(event));

    next();

    expect(events).to.have.lengthOf(1);
    expect(events[0]).toMatchObject({ state: 'second' });

    next();

    expect(events).to.have.lengthOf(2);
    expect(events[1]).toMatchObject({ state: 'third' });
  });

  it('should subscribe to USER_PREV_STEP events', () => {
    workflowService.subscribe('USER_PREV_STEP', event => events.push(event));

    next();
    prev();

    expect(events).to.have.lengthOf(1);
    expect(events[0]).toMatchObject({ state: 'first' });
  });

  it('should subscribe to WILD_CARD events', async () => {
    breakLocalStorage();

    workflowService = new WorkflowBrowserSDK(errorWorkflow);

    workflowService.subscribe('*', event => events.push(event));

    // Don't fire USER_PREV_STEP from the first step.
    next();
    prev();
    next();

    // Wait for the http request to finish
    await sleep(300);

    // Ensure both arrays are ordered the same way
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

  it('should subscribe to ERROR events', async () => {
    breakLocalStorage();

    workflowService = new WorkflowBrowserSDK(errorWorkflow);

    workflowService.subscribe('ERROR', event => events.push(event));

    next();

    // Wait for the http request to finish
    await sleep(300);

    expect(events).to.have.lengthOf(2);

    const httpError = events.find(({ type }: { type: string }) => type === 'HTTP_ERROR');
    const unexpectedError = events.find(({ type }: { type: string }) => type === 'ERROR');

    expect(httpError.error).to.be.instanceOf(HttpError);
    expect(unexpectedError.error).to.be.instanceOf(Error);
  });

  it('should subscribe to HTTP_ERROR events', async () => {
    workflowService = new WorkflowBrowserSDK(errorWorkflow);

    workflowService.subscribe('HTTP_ERROR', event => events.push(event));

    next();

    // Wait for the http request to finish
    await sleep(300);

    expect(events).to.have.lengthOf(1);
    expect(events[0]).to.not.have.property('type');
    expect(events[0].error).toBeInstanceOf(HttpError);
  });

  it('should subscribe to user defined events', () => {
    workflowService = new WorkflowBrowserSDK({
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

    workflowService.subscribe('custom', event => events.push(event));

    workflowService.sendEvent({
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
