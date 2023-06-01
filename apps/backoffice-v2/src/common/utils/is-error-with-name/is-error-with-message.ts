import { isObject } from '../is-object/is-object';
import { IErrorWithName } from './interfaces';

export const isErrorWithName = (error: unknown): error is IErrorWithName => {
  return isObject(error) && 'name' in error && typeof error.name === 'string';
};
