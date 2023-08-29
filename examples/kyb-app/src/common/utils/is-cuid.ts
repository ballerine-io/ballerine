export const isCuid = (str: unknown): str is string => {
  if (typeof str !== 'string') return false;

  const CUIDRegExp = /^[a-z0-9]{7,}$/;

  return CUIDRegExp.test(str);
};
