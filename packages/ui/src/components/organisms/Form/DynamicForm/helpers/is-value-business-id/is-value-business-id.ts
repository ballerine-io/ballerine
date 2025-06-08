export const isValueBusinessId = (value: unknown): value is string => {
  if (typeof value !== 'string') return false;

  return true;
};
