import { AnyObject } from '@ballerine/ui';
import { RJSFValidationError } from '@rjsf/utils';

export const transformRJSFErrors = (errors: RJSFValidationError[]): RJSFValidationError[] => {
  return errors.map(error => {
    if (error.name === 'required') {
      error.message = 'This field is required.';
    }

    if (error.name === 'minLength') {
      error.message = `This field must be at least ${error.params.limit} characters long.`;
    }

    if (error.name === 'maxLength') {
      error.message = `This field must be at most ${error.params.limit} characters long.`;
    }

    if (
      error.name === 'enum' &&
      Array.isArray((error.params as AnyObject).allowedValues as any[]) &&
      ((error.params as AnyObject).allowedValues as boolean[]).includes(true)
    ) {
      error.message = 'Must be checked.';
    }

    if (error.name === 'oneOf') {
      error.message = 'Value must be selected from list.';
    }

    // Removing oneOf constant specific errors(they are generated from each item in oneOf array of schema)
    if (error.message?.includes('constant')) {
      error.message = '';
    }

    if (error.params?.type === 'number') {
      error.message = 'This field is required';
    }

    if (error.params?.type === 'object') {
      error.message = 'This field is required';
    }

    if (error.name === 'minItems') {
      error.message = `Plead add at least ${error?.params.limit} item${
        error?.params.limit > 1 ? 's' : ''
      }.`;
    }

    if (error.params?.format === 'email') {
      error.message = 'Please provide valid email address.';
    }

    if (error.params?.format === 'minAge18') {
      error.message = 'You must be at least 18 years old to apply.';
    }

    return error;
  });
};
