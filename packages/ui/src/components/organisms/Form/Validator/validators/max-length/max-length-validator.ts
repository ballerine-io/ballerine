import { TValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message';
import { IMaxLengthValueValidatorParams } from './types';

export const maxLengthValidator: TValidator<string, IMaxLengthValueValidatorParams> = (
  value,
  params,
) => {
  const { message = 'Maximum length is {maxLength}.' } = params;

  if (value?.length === undefined) return true;

  if (value?.length > params.value.maxLength) {
    throw new Error(formatErrorMessage(message, 'maxLength', params.value.maxLength.toString()));
  }

  return true;
};
