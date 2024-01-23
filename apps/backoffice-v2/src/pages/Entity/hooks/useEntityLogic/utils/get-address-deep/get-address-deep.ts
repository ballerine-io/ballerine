type Address =
  | {
      country: string;
      city: string;
      street: string;
    }
  | string;

/**
 * Traverses an object and returns the first address object found.
 * @param {unknown} value - The value object to search for the address.
 * @param {Object} options - The options object.
 * @param {string} [options.propertyName='address'] - The name of the property that represents the address.
 * @returns {Address|undefined} The address or undefined if not found.
 */
export const getAddressDeep = (
  value: unknown,
  {
    propertyName = 'address',
  }: {
    propertyName?: string;
  } = {},
): Address | undefined => {
  if (!value || typeof value !== 'object') return;

  // Early return for Array type
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const result = getAddressDeep(value[i], { propertyName });

      if (result) return result;
    }

    return;
  }

  for (const key of Object.keys(value)) {
    if (key === propertyName) return value[key];

    const result = getAddressDeep(value[key], { propertyName });

    if (result) return result;
  }

  return;
};
