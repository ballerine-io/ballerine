import { GenericFunction } from '../../types';

export const isInstanceOfFunction = (value: unknown): value is GenericFunction =>
  value instanceof Function;
