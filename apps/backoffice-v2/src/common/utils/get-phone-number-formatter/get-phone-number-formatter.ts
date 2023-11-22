import { parsePhoneNumber } from 'libphonenumber-js';

/**
 * Wraps {@link parsePhoneNumber} with try catch.
 * @param value
 */
export const getPhoneNumberFormatter = (value: string) => {
  let formatter: ReturnType<typeof parsePhoneNumber>;

  try {
    formatter = parsePhoneNumber(value);

    return formatter;
  } catch {
    return;
  }
};
