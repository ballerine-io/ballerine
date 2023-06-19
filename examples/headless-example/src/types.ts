import type { SubmitContext } from '@felte/core';
import type { z, ZodSchema } from 'zod';

export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<Serializable>
  | { [key: PropertyKey]: Serializable };

export type ObjectValues<TObject> = TObject[keyof TObject];

export type TOnPrev<TSchema extends ZodSchema> = (data: z.infer<TSchema>) => () => void;

export type TOnSubmit<TSchema extends ZodSchema> = (
  data: z.infer<TSchema>,
  context: SubmitContext<z.infer<TSchema>>,
) => void;

export type FetchInitWithJson<TBody> = Omit<RequestInit, 'body'> & {
  body?: TBody;
  serializer?: (body: TBody) => BodyInit;
};

export const State = {
  WELCOME: 'WELCOME',
  DOCUMENT_SELECTION: 'DOCUMENT_SELECTION',
  DOCUMENT_PHOTO: 'DOCUMENT_PHOTO',
  FINAL: 'FINAL',
  SUBMIT: 'SUBMIT',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
  RESUBMISSION: 'RESUBMISSION',
} as const;
