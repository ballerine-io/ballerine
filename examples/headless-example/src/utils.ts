import type { WorkflowOptionsBrowser } from '@ballerine/workflow-browser-sdk';
import type { FormConfigWithoutTransformFn, Obj } from '@felte/core';
import { reporter } from '@felte/reporter-svelte';
import { validator } from '@felte/validator-zod';
import { createForm } from 'felte';
import type { z, ZodSchema } from 'zod';
import type { FetchInitWithJson, Serializable } from './types';
import type { WorkflowBrowserSDK } from '@ballerine/workflow-browser-sdk';
import { createWorkflow } from '@ballerine/workflow-browser-sdk';
import { getContext, setContext } from 'svelte';

export const setWorkflowContext = (service: InstanceType<typeof WorkflowBrowserSDK>) => {
  setContext('workflow', service);
};

export const getWorkflowContext = () =>
  getContext<InstanceType<typeof WorkflowBrowserSDK>>('workflow');

export const initWorkflowContext = (options: WorkflowOptionsBrowser) => {
  const workflowService = createWorkflow(options);

  setWorkflowContext(workflowService);

  return workflowService;
};

export const createZodForm = <TSchema extends ZodSchema, TExt extends Obj = Obj>(
  schema: TSchema,
  config: FormConfigWithoutTransformFn<z.infer<TSchema>> & TExt,
) => {
  return createForm({
    extend: [validator({ schema }), reporter()],
    ...config,
  });
};

export const log = (condition: boolean, ...args: any[]) => condition && console.log(...args);

export const dump = (value: Serializable) => JSON.stringify(value, null, 2);

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const makeWorkflow = (data: unknown): WorkflowOptionsBrowser => {
  const { workflowDefinition, workflowRuntimeData } = data ?? {};
  const { definition, definitionType, ...rest } = workflowDefinition ?? {};

  return {
    ...rest,
    definitionType,
    definition: {
      ...definition,
      id: workflowRuntimeData.id,
      initial: workflowRuntimeData?.state ?? definition.initial,
      context: workflowRuntimeData.context,
    },
    workflowContext: {
      machineContext: workflowRuntimeData.context,
      state: workflowRuntimeData?.state ?? definition.initial,
    },
    backend: {
      baseUrl: 'http://localhost:3000/api/external',
    },
  };
};

export const fetchThrowNotOk = async <TData, TBody = Record<string, unknown>>(
  ...args: Parameters<typeof fetch>
) => {
  const res = await fetch(...args);

  if (!res.ok) {
    throw new Error(`${res.statusText} (${res.status})`);
  }

  return res;
};

export const fetchSerialize = async <TBody>(
  input: RequestInfo | URL,
  init: FetchInitWithJson<TBody> = {
    serializer: body => JSON.stringify(body),
  },
) => {
  const res = await fetchThrowNotOk(input, {
    ...init,
    body: init?.body && init?.method !== 'GET' ? init?.serializer?.(init.body) : undefined,
  });

  return res;
};

export const fetchJson = async <TData, TBody = Record<string, unknown>>(
  input: RequestInfo | URL,
  init?: FetchInitWithJson<TBody>,
) => {
  const res = await fetchSerialize(input, init);
  const data: TData = await res.json();

  return data;
};

export const fetchBlob = async <TData, TBody = Record<string, unknown>>(
  input: RequestInfo | URL,
  init?: FetchInitWithJson<TBody>,
) => {
  const res = await fetchSerialize(input, init);

  return res.blob();
};

export const handlePromise = async <TData>(
  promise: Promise<TData>,
): Promise<[data: TData, error: undefined] | [data: undefined, error: unknown]> => {
  try {
    const data = await promise;

    return [data, undefined];
  } catch (err) {
    return [undefined, err];
  }
};
