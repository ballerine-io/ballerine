import { beforeEach, describe, expect, it } from 'vitest';
import { backendOptions } from '../backend-options';
import { sleep } from '../utils';
import { WorkflowBrowserSDK } from '../workflow-browser-sdk';
import { response } from './msw';
import { shortWorkflow, workflowOptions } from './workflow-options';

let workflowService: WorkflowBrowserSDK;
let documents: Array<string> = [];
let context: {
  documents: Array<string>;
  email: string;
};
let state: string;

const updateValues = () => {
  context = workflowService.getSnapshot().context as typeof context;
  documents = context.documents;
  state = workflowService.getSnapshot().value as string;
};

beforeEach(() => {
  workflowService = new WorkflowBrowserSDK(workflowOptions);
  updateValues();
});

const next = (payload?: Record<PropertyKey, any>) => {
  workflowService?.sendEvent({
    type: 'USER_NEXT_STEP',
    payload,
  });
  updateValues();
};
const prev = (payload?: Record<PropertyKey, any>) => {
  workflowService?.sendEvent({
    type: 'USER_PREV_STEP',
    payload,
  });
  updateValues();
};

describe('smoke', () => {
  it('should create a workflow service', () => {
    expect(workflowService).to.be.instanceOf(WorkflowBrowserSDK);
    expect(workflowService.getSnapshot()).to.have.property('value', 'first');
  });

  it('should update context on USER_NEXT_STEP', () => {
    // Does not result in ['document1', 'document1']
    next({
      documents: ['document1'],
    });

    expect(documents).toStrictEqual(['document1']);

    next({
      documents: ['document1'],
    });

    expect(documents).toStrictEqual(['document1']);

    // Allows partial updates
    next({
      documents: [...documents, 'document2'],
    });

    expect(documents).toStrictEqual(['document1', 'document2']);

    // Does not touch unrelated context
    next({
      email: 'john@doe.com',
    });

    expect(context).toMatchObject({
      documents: ['document1', 'document2'],
      email: 'john@doe.com',
    });
  });

  it('should update context on USER_PREV_STEP', () => {
    // One before last
    while (state !== 'fifth') {
      next();
    }

    // Does not result in ['document1', 'document1']
    prev({
      documents: ['document1'],
    });

    expect(documents).toStrictEqual(['document1']);

    prev({
      documents: ['document1'],
    });

    expect(documents).toStrictEqual(['document1']);

    // Allows partial updates
    prev({
      documents: [...documents, 'document2'],
    });

    expect(documents).toStrictEqual(['document1', 'document2']);

    // Does not touch unrelated context
    prev({
      email: 'john@doe.com',
    });

    expect(context).toMatchObject({
      documents: ['document1', 'document2'],
      email: 'john@doe.com',
    });
  });

  it('should fire an HTTP request using the backend config', async () => {
    workflowService = new WorkflowBrowserSDK(shortWorkflow);

    // Uses default backend config
    next();

    await sleep(300);

    expect(response).toMatchObject({
      baseUrl: backendOptions.baseUrl,
      method: backendOptions.endpoints.persist.method,
      endpoint: backendOptions.endpoints.persist.endpoint,
    });

    // Uses user defined backend config

    const userDefined = {
      baseUrl: 'http://localhost:3000',
      method: 'POST',
      endpoint: '/test',
    } as const;

    workflowService = new WorkflowBrowserSDK({
      ...shortWorkflow,
      backend: {
        baseUrl: userDefined.baseUrl,
        endpoints: {
          persist: {
            method: userDefined.method,
            endpoint: userDefined.endpoint,
          },
        },
        headers: {
          Authorization: 'Bearer test',
        },
      },
    });

    next();

    await sleep(300);

    expect(response).toMatchObject(userDefined);
  });
});
