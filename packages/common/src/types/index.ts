export type AnyRecord = Record<PropertyKey, unknown>;
export type Serializable =
  | string
  | number
  | boolean
  | null
  | undefined
  | Serializable[]
  | { [key: PropertyKey]: Serializable };
export type { LoggerInterface } from './logger.interface';

export type SortDirection = 'asc' | 'desc';

export type GenericFunction = (...args: any[]) => any;

export type ObjectValues<TObject extends AnyRecord> = TObject[keyof TObject];

export type DeepPartial<TValue> = {
  [TKey in keyof TValue]?: TValue[TKey] extends Record<string, unknown>
    ? DeepPartial<TValue[TKey]>
    : TValue extends Array<infer U>
    ? Array<DeepPartial<U>>
    : TValue[TKey];
};
