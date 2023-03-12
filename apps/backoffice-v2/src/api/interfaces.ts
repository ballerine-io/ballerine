import { AnyArray, AnyRecord, TMethod } from '../types';
import { Method } from '../enums';
import { z, ZodSchema } from 'zod';

/**
 * Expect {@link Method.GET} and {@link Method.DELETE} to not have a body.
 */
export interface IApiClient {
  <TBody extends AnyRecord, TZodSchema extends ZodSchema>(params: {
    endpoint: string;
    method: typeof Method.POST | typeof Method.PUT | typeof Method.PATCH;
    body?: TBody;
    options?: Omit<RequestInit, 'body'>;
    timeout?: number;
    schema: TZodSchema;
  }): Promise<[z.infer<TZodSchema>, undefined] | [undefined, Error]>;

  <TZodSchema extends ZodSchema>(params: {
    endpoint: string;
    method: typeof Method.GET | typeof Method.DELETE;
    options?: Omit<RequestInit, 'body'>;
    timeout?: number;
    schema: TZodSchema;
  }): Promise<[z.infer<TZodSchema>, undefined] | [undefined, Error]>;
}

export interface IEndpoint {
  [key: string]: {
    [key: string]:
      | {
          default: {
            endpoint: (...args: AnyArray) => string;
            method: TMethod;
          };
          [key: string]: {
            endpoint: (...args: AnyArray) => string;
            method: TMethod;
          };
        }
      | {
          endpoint: (...args: AnyArray) => string;
          method: TMethod;
        };
  };
}

export interface IEndUserIdAndWorkflowId {
  endUserId: string;
  workflowId: string;
}
