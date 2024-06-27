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
