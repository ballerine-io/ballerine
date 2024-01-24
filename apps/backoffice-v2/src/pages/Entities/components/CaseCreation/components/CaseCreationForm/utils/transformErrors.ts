import { AnyObject } from '@ballerine/ui';
import { RJSFValidationError } from '@rjsf/utils';

export const transformErrors = (errors: RJSFValidationError[]): RJSFValidationError[] => {
  return errors.map(error => {
    const errorCopy = structuredClone(error);

    if (errorCopy.name === 'minLength' || errorCopy.name === 'required') {
      errorCopy.message = 'This field is required.';
    }

    if (
      errorCopy.name === 'enum' &&
      Array.isArray((errorCopy.params as AnyObject).allowedValues as any[]) &&
      ((errorCopy.params as AnyObject).allowedValues as boolean[]).includes(true)
    ) {
      errorCopy.message = 'Must be checked.';
    }

    if (errorCopy.name === 'oneOf') {
      errorCopy.message = 'Value must be selected from list.';
    }

    // Removing oneOf constant specific errors(they are generated from each item in oneOf array of schema)
    if (errorCopy.message?.includes('constant')) {
      errorCopy.message = '';
    }

    if (errorCopy.params?.type === 'number') {
      errorCopy.message = 'This field is required';
    }

    if (errorCopy.params?.type === 'object') {
      errorCopy.message = 'This field is required';
    }

    if (errorCopy.name === 'minItems') {
      errorCopy.message = `Plead add at least ${errorCopy?.params.limit} item${
        errorCopy?.params.limit > 1 ? 's' : ''
      }.`;
    }

    if (errorCopy.params?.format === 'email') {
      errorCopy.message = 'Please provide valid email address.';
    }

    return errorCopy;
  });
};
