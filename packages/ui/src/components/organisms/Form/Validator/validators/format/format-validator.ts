import EmailValidator from 'email-validator';
import { parsePhoneNumber } from 'libphonenumber-js';
import { TValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message';
import { IFormatValueValidatorParams } from './types';

export const formatValidator: TValidator<unknown, IFormatValueValidatorParams> = (
  value,
  params,
) => {
  if (typeof value !== 'string') {
    return true;
  }

  const { message = 'Invalid {format} format.' } = params;

  if (params.value.format === 'email') {
    const isValid = EmailValidator.validate(value as string);

    if (!isValid) {
      throw new Error(formatErrorMessage(message, 'format', 'email'));
    }

    return true;
  }

  if (params.value.format === 'phone') {
    try {
      const parsedPhoneNumber = parsePhoneNumber(value?.startsWith('+') ? value : `+${value}`);

      const isValid = parsedPhoneNumber.isValid();

      if (!isValid) {
        throw new Error(formatErrorMessage(message, 'format', 'phone'));
      }

      return true;
    } catch (error) {
      throw new Error(formatErrorMessage(message, 'format', 'phone'));
    }
  }

  throw new Error(`Format validator ${params.value.format} is not supported.`);
};
