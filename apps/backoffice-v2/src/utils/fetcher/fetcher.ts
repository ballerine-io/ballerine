import { IFetcher } from './interfaces';
import { handlePromise } from '@ballerine/common';
import { isZodError } from '../is-zod-error/is-zod-error';

export const fetcher: IFetcher = async ({
  url,
  method,
  body,
  options,
  timeout = 5000,
  schema,
  isBlob = false,
}) => {
  const controller = new AbortController();
  const { signal } = controller;
  const timeoutRef = setTimeout(() => {
    controller.abort(`Request timed out after ${timeout}ms`);
  }, timeout);
  const [res, fetchError] = await handlePromise(
    fetch(url, {
      ...options,
      method,
      signal,
      body: method !== 'GET' && body ? JSON.stringify(body) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers ?? {}),
      },
    }),
  );
  clearTimeout(timeoutRef);

  if (fetchError) {
    console.error(fetchError);

    throw fetchError;
  }

  if (!res.ok) {
    const message = `${res.statusText} (${res.status})`;

    console.error(message);

    throw new Error(message);
  }

  const [data, jsonError] = isBlob
    ? await handlePromise(res.blob())
    : res.headers.get('content-length') > '0'
    ? await handlePromise(res.json())
    : [undefined, undefined];

  if (jsonError) {
    console.error(jsonError);

    throw jsonError;
  }

  const [validatedData, validationError] = await handlePromise(schema.parseAsync(data));

  if (validationError) {
    const messages = isZodError(validationError)
      ? validationError.errors.map(({ path, message }) => `${path.join('.')} (${message}),\n`)
      : [validationError];

    console.error('❌ Validation error:\n', ...messages);

    throw validationError;
  }

  return validatedData;
};
