import { parsePhoneNumber } from 'libphonenumber-js';

/**
 * Wraps {@link parsePhoneNumber} with try catch.
 * @param value
 */
export const getPhoneNumberFormatter = (value: string) => {
  try {
    if (!/^(?!-)(?!\+?$)(?!-+$)(?!.*-\+)(?!.*--)\+?[\d-]+(?<!-)$/.test(value)) {
      return;
    }

    return parsePhoneNumber(value);
  } catch {
    return;
  }
};
