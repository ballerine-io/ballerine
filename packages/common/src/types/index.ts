export { type AnyRecord } from './any-record';
export const SchemaType = {
  DEFAULT: 'default',
  INSERT: 'insert',
} as const;

export const SchemaTypes = [SchemaType.DEFAULT, SchemaType.INSERT] as const;

export type TSchemaType = (typeof SchemaTypes)[number];
