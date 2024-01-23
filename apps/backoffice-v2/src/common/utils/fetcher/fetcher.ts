import { terminal } from 'virtual:terminal';
import { HttpError } from '../../errors/http-error';
import { handlePromise } from '../handle-promise/handle-promise';
import { isZodError } from '../is-zod-error/is-zod-error';
import { IFetcher } from './interfaces';

export const fetcher: IFetcher = async ({
  url,
  method,
  body,
  headers = {
    'Content-Type': 'application/json',
  },
  options,
  timeout = 10000,
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
      headers,
    }),
  );
  clearTimeout(timeoutRef);

  if (fetchError) {
    console.error(fetchError);

    throw fetchError;
  }

  if (!res.ok) {
    let message = `${res.statusText} (${res.status})`;

    if (res.status === 400) {
      const json = await res.json();

      message = Array.isArray(json?.errors)
        ? json?.errors?.map(({ message }) => `${message}\n`)?.join('')
        : message;
    }

    console.error(message);

    throw new HttpError(res.status, message);
  }

  const parseResponse = async () => {
    if (res.status === 204) {
      return [undefined, undefined];
    }

    if (isBlob) {
      return await handlePromise(res.blob());
    }

    if (!res.headers.get('content-length') || res.headers.get('content-length') > '0') {
      // TODO: make sure its json by checking the content-type in order to safe access to json method
      return await handlePromise(res.json());
    }

    return [undefined, undefined];
  };
  const [data, jsonError] = await parseResponse();

  if (jsonError) {
    console.error(jsonError);

    throw jsonError;
  }

  const [validatedData, validationError] = await handlePromise(schema.parseAsync(data));

  if (validationError) {
    const messages = isZodError(validationError)
      ? validationError.errors.map(({ path, message }) => `${path.join('.')} (${message}),\n`)
      : [validationError];

    terminal.error('❌ Validation error:\n', ...messages);

    throw validationError;
  }

  return validatedData;
};
