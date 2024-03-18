import { sleep } from '@ballerine/common';
import { DefaultBodyType, PathParams, ResponseResolver, rest, RestContext, RestRequest } from 'msw';
import { setupServer } from 'msw/node';
import { backendOptions } from '../backend-options';

export let response:
  | {
      method: string;
      baseUrl: string;
      endpoint: string;
      headers?: HeadersInit;
    }
  | undefined;

// Bypasses being unable to set response when imported.
export const resetResponse = () => {
  response = undefined;
};

const handler: ResponseResolver<
  RestRequest<DefaultBodyType, PathParams<string>>,
  RestContext,
  DefaultBodyType
> = async (req, res, ctx) => {
  // Temporary - allows observing loading state
  await sleep(Math.round(Math.random() * 300));

  response = {
    method: req.method,
    baseUrl: req.url.origin,
    endpoint: req.url.pathname,
    headers: Object.fromEntries(req.headers.entries()),
  };

  return res(ctx.status(200), ctx.json({}));
};

const restHandlers = [
  rest.patch(`${backendOptions.baseUrl}${backendOptions.endpoints.persist.endpoint}`, handler),
  rest.post('http://localhost:3000/test', handler),
  // Error on all other requests
  rest.all('*', async (req, res, ctx) => {
    await sleep(Math.round(Math.random() * 300));

    resetResponse();

    return res(ctx.status(404), ctx.json({}));
  }),
];

export const server = setupServer(...restHandlers);
