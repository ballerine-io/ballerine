import { IFetcher } from './interfaces';
import { handlePromise } from '../handle-promise/handle-promise';
import { isZodError } from '../is-zod-error/is-zod-error';
import { HttpError } from '../../errors/http-error';
import { terminal } from 'virtual:terminal';

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
    let message = `${res.statusText} (${res.status})`;

    if (res.status === 400) {
      const json = await res.json();

      message = Array.isArray(json?.message)
        ? json?.message?.map(({ message }) => `${message}\n`)?.join('')
        : message;
    }

    console.error(message);

    throw new HttpError(res.status, message);
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

    terminal.error('❌ Validation error:\n', ...messages);

    throw validationError;
  }

  return validatedData;
};
