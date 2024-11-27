import { HTTPError } from 'ky';

export const isExceptionWillBeHandled = (error: HTTPError) => {
  return error.message === 'No EndUser is set for this token';
};
