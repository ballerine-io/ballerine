import EmailValidator from 'email-validator';
import { TValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message';
import { IFormatValueValidatorParams } from './types';

export const formatValidator: TValidator<unknown, IFormatValueValidatorParams> = (
  value,
  params,
) => {
  if (typeof value !== 'string') return true;

  const { message = 'Invalid {format} format.' } = params;

  if (params.value.format === 'email') {
    const isValid = EmailValidator.validate(value as string);

    if (!isValid) {
      throw new Error(formatErrorMessage(message, 'format', 'email'));
    }

    return true;
  }

  throw new Error(`Format validator ${params.value.format} is not supported.`);
};
