import { isObject } from '@/utils';
import { IErrorWithMessage } from './interfaces';

export const isErrorWithMessage = (error: unknown): error is IErrorWithMessage => {
  return isObject(error) && 'message' in error && typeof error.message === 'string';
};
