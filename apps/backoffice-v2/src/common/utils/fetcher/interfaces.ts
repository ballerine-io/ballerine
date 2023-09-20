import { Method } from '../../enums';
import { AnyRecord } from '../../types';
import { z, ZodSchema } from 'zod';

/**
 * Expect {@link Method.GET} and {@link Method.DELETE} to not have a body.
 */
export interface IFetcher {
  <TBody extends AnyRecord, TZodSchema extends ZodSchema>(params: {
    url: string;
    method: typeof Method.POST | typeof Method.PUT | typeof Method.PATCH;
    body?: TBody;
    headers?: RequestInit['headers'];
    options?: Omit<RequestInit, 'body' | 'headers'>;
    timeout?: number;
    schema: TZodSchema;
    isBlob?: boolean;
  }): Promise<z.infer<TZodSchema>>;

  <TZodSchema extends ZodSchema>(params: {
    url: string;
    method: typeof Method.GET | typeof Method.DELETE;
    headers?: RequestInit['headers'];
    options?: Omit<RequestInit, 'body' | 'headers'>;
    timeout?: number;
    schema: TZodSchema;
  }): Promise<z.infer<TZodSchema>>;
}
