export const getAddressDeep = (
  value: unknown,
):
  | {
      country: string;
      city: string;
      street: string;
    }
  | undefined => {
  if (!value || typeof value !== 'object') return;

  // Early return for Array type
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const result = getAddressDeep(value[i]);

      if (result) return result;
    }

    return;
  }

  for (const key of Object.keys(value)) {
    if (key === 'address') return value[key];

    const result = getAddressDeep(value[key]);

    if (result) return result;
  }

  return;
};
