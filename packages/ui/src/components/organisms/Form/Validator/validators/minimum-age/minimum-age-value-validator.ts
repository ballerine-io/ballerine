import dayjs from 'dayjs';
import { TValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message/format-error-message';
import { IMinimumAgeValidatorParams } from './types';

export const minimumAgeValueValidator: TValidator<string, IMinimumAgeValidatorParams> = (
  value,
  params,
) => {
  const { message = 'Minimum age is {minimumAge}.' } = params;
  const isValid = dayjs(value).isValid();

  if (!isValid) {
    throw new Error('Invalid date.');
  }

  // Default to 18 if not specified
  const requiredAge = params?.value?.minimumAge;

  if (!requiredAge) {
    throw new Error('Minimum age is not specified.');
  }

  const today = dayjs();
  const birthDate = dayjs(value);

  let age = today.year() - birthDate.year();
  const monthDiff = today.month() - birthDate.month();

  if (monthDiff < 0 || (monthDiff === 0 && today.date() < birthDate.date())) {
    age--;
  }

  if (age < requiredAge) {
    throw new Error(formatErrorMessage(message, 'minimumAge', requiredAge.toString()));
  }
};
