import { getDocumentId } from '@ballerine/common';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { WorkflowBrowserSDK, WorkflowOptionsBrowser } from '@ballerine/workflow-browser-sdk';
import { createWorkflow } from '@ballerine/workflow-browser-sdk';
import type { FormConfigWithoutTransformFn, Obj } from '@felte/core';
import { reporter } from '@felte/reporter-svelte';
import { validator } from '@felte/validator-zod';
import { createForm } from 'felte';
import { getContext, setContext } from 'svelte';
import type { z, ZodSchema } from 'zod';
import type { FetchInitWithJson, Serializable } from './types';

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

export const makeWorkflow = (data: {
  workflowDefinition: any;
  workflowRuntimeData: any;
}): WorkflowOptionsBrowser => {
  const { workflowDefinition, workflowRuntimeData } = data ?? {};
  const { definition, definitionType, ...rest } = workflowDefinition ?? {};

  return {
    ...rest,
    definitionType,
    definition: {
      ...definition,
      id: workflowRuntimeData?.id,
      initial: workflowRuntimeData?.state ?? definition?.initial,
      context: workflowRuntimeData?.context,
    },
    workflowContext: {
      machineContext: workflowRuntimeData?.context,
      state: workflowRuntimeData?.state ?? definition?.initial,
    },
    backend: {
      baseUrl: 'http://localhost:3000/api/v1/external',
      headers: {
        Authorization:
          import.meta.env.MODE === 'development'
            ? `Api-Key ${import.meta.env.VITE_API_KEY}`
            : undefined,
      },
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
  init?: FetchInitWithJson<TBody>,
) => {
  const serializer = init?.serializer ?? JSON.stringify;
  const res = await fetchThrowNotOk(input, {
    ...init,
    body: init?.body && init?.method !== 'GET' ? serializer?.(init.body) : undefined,
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  });

  return res;
};

export const fetchJson = async <TData, TBody = Record<string, unknown>>(
  input: RequestInfo | URL,
  init?: FetchInitWithJson<TBody>,
) => {
  const res = await fetchSerialize(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Api-Key ${import.meta.env.VITE_API_KEY}`,
    },
  });
  const data: TData = await res.json();

  return data;
};

export const fetchBlob = async <TData, TBody = Record<string, unknown>>(
  input: RequestInfo | URL,
  init?: FetchInitWithJson<TBody>,
) => {
  const res = await fetchSerialize(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Api-Key ${import.meta.env.VITE_API_KEY}`,
    },
  });

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

export const ctw = (...classNames: Array<ClassValue>) => twMerge(clsx(classNames));
export const camelCaseToTitle = (str: string) =>
  str
    ?.replace(/([A-Z])/g, ' $1')
    ?.replace(/^./, str => str?.toUpperCase())
    ?.replace(/id/i, 'ID');

export const getSnapshotContext = (workflowService: InstanceType<typeof WorkflowBrowserSDK>) =>
  workflowService?.getSnapshot()?.context;
export const makeDocument = ({
  id,
  payload,
}: {
  id: string;
  payload: {
    [key: string]: {
      id: string;
      fileType: string;
    };
  };
}) => {
  const [category, type, issuerCountry] = id?.split('-') ?? [];

  return {
    category,
    type,
    issuer: {
      country: issuerCountry,
    },
    pages: [
      {
        ballerineFileId: payload?.[id]?.id,
        type: payload?.[id]?.fileType === 'application/pdf' ? 'pdf' : 'png',
        provider: 'http',
        uri: '',
      },
    ],
    properties: {
      userNationalId: `GHA-123456789-1`,
      docNumber: '123456789',
      userAddress: 'address',
      website: 'http://localhost:3000',
      expiryDate: '2021-12-31',
      email: 'fake@fake.com',
    },
  };
};
// Update document if it exists, otherwise add a new document.
export const upsertDocument = ({
  documents,
  document,
}: {
  documents: Array<any>;
  document: any;
}) => {
  const documentExists = documents?.some(
    doc => getDocumentId(doc, false) === getDocumentId(document, false),
  );

  if (!Array.isArray(documents) || !documents?.length) return [document];

  return !documentExists
    ? [...documents, document]
    : documents?.map(doc => {
        if (getDocumentId(doc, false) !== getDocumentId(document, false)) return doc;

        return document;
      });
};
