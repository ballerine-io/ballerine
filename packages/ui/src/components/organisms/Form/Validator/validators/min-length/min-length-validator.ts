import { TValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message';
import { TMinLengthValidatorParams } from '@ballerine/common';

export const minLengthValidator: TValidator<string, TMinLengthValidatorParams> = (
  value,
  params,
) => {
  const { message = 'Minimum length is {minLength}.' } = params;

  if (value?.length === undefined) return true;

  if (value?.length < params.value.minLength) {
    throw new Error(formatErrorMessage(message, 'minLength', params.value.minLength.toString()));
  }
};
