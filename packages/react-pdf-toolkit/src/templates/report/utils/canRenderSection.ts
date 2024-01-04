export const canRenderSection = (value: unknown): boolean => {
  if (!value) return false;

  if (typeof value === 'object' && !Object.keys(value).length) return false;

  return true;
};
