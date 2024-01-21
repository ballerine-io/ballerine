export const isNonEmptyArray = (value: unknown) => {
  return Array.isArray(value) && value.length > 0;
};
