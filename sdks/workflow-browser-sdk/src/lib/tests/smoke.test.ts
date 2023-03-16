import { sleep } from '@ballerine/common';
import { beforeEach, describe, expect, it } from 'vitest';
import { backendOptions } from '../backend-options';
import { WorkflowBrowserSDK } from '../workflow-browser-sdk';
import { response } from './msw';
import { shortWorkflow, workflowOptions } from './workflow-options';

interface IContext {
  documents: Array<string>;
  email: string;
}

let workflowService: WorkflowBrowserSDK;
let documents: Array<string> = [];
let context: IContext;
let state: string;

// Headers returned from mock service worker are lowercased
const lowerCaseObjKeys = (obj: Record<PropertyKey, unknown>) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key.toLowerCase()] = value;

    return acc;
  }, {} as Record<PropertyKey, unknown>);

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

    const lowerCaseDefaultHeaders = lowerCaseObjKeys(backendOptions.headers);

    expect(response).toMatchObject({
      baseUrl: backendOptions.baseUrl,
      method: backendOptions.endpoints.persist.method,
      endpoint: backendOptions.endpoints.persist.endpoint.replace(
        ':workflowId',
        shortWorkflow.definition.id ?? '',
      ),
      headers: lowerCaseDefaultHeaders,
    });

    // Uses user defined backend config

    const userDefined = {
      baseUrl: 'http://localhost:3000',
      method: 'POST',
      endpoint: '/test',
      headers: {
        'X-Response-Time': '1000',
        Authorization: 'Api-Key test',
      },
    } as const;
    const lowerCaseUserDefinedHeaders = lowerCaseObjKeys(userDefined.headers);

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
        headers: userDefined.headers,
      },
    });

    next();

    await sleep(300);

    expect(response).toMatchObject({
      ...userDefined,
      headers: {
        ...lowerCaseDefaultHeaders,
        ...lowerCaseUserDefinedHeaders,
      },
    });
  });
});
