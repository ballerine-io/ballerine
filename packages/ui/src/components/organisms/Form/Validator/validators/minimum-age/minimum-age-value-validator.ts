import dayjs from 'dayjs';
import { TValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message/format-error-message';
import { IMinimumAgeValidatorParams } from './types';

const validateStrict = (value: string, requiredAge: number) => {
  const today = dayjs();
  const birthDate = dayjs(value);

  // Calculate age using dayjs diff
  const age = today.diff(birthDate, 'year');

  if (age < requiredAge) {
    return false;
  }

  return true;
};

const validateNonStrict = (value: string, requiredAge: number) => {
  const currentYear = dayjs().year();
  const birthYear = dayjs(value).year();

  if (currentYear - birthYear < requiredAge) {
    return false;
  }

  return true;
};

export const minimumAgeValueValidator: TValidator<string, IMinimumAgeValidatorParams> = (
  value,
  params,
) => {
  const { minimumAge, strict = true } = params?.value || {};
  const { message = 'Minimum age is {minimumAge}.' } = params;

  if (!dayjs(value).isValid()) {
    throw new Error('Invalid date.');
  }

  if (!minimumAge) {
    throw new Error('Minimum age is not specified.');
  }

  // Calculate age using dayjs diff
  const isValid = strict ? validateStrict(value, minimumAge) : validateNonStrict(value, minimumAge);

  if (!isValid) {
    throw new Error(formatErrorMessage(message, 'minimumAge', minimumAge.toString()));
  }

  return true;
};
