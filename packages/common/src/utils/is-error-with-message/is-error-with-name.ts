import { isObject } from '@/utils';
import {IErrorWithName} from './interfaces';

export const isErrorWithName = (error: unknown): error is IErrorWithName => {
  return isObject(error) && 'name' in error && typeof error.name === 'string';
};
