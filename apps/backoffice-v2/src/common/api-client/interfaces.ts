import { AnyRecord } from '../types';
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
    isBlob?: boolean;
  }): Promise<[z.infer<TZodSchema>, undefined] | [undefined, Error]>;

  <TBody extends AnyRecord, TZodSchema extends ZodSchema>(params: {
    url: string;
    method: typeof Method.POST | typeof Method.PUT | typeof Method.PATCH;
    body?: TBody;
    options?: Omit<RequestInit, 'body'>;
    timeout?: number;
    schema: TZodSchema;
    isBlob?: boolean;
  }): Promise<[z.infer<TZodSchema>, undefined] | [undefined, Error]>;

  <TZodSchema extends ZodSchema>(params: {
    endpoint: string;
    method: typeof Method.GET | typeof Method.DELETE;
    options?: Omit<RequestInit, 'body'>;
    timeout?: number;
    schema: TZodSchema;
    isBlob?: boolean;
  }): Promise<[z.infer<TZodSchema>, undefined] | [undefined, Error]>;

  <TZodSchema extends ZodSchema>(params: {
    url: string;
    method: typeof Method.GET | typeof Method.DELETE;
    options?: Omit<RequestInit, 'body'>;
    timeout?: number;
    schema: TZodSchema;
    isBlob?: boolean;
  }): Promise<[z.infer<TZodSchema>, undefined] | [undefined, Error]>;
}
