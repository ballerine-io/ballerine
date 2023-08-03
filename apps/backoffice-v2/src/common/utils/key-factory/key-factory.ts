export const keyFactory = (...keys: Array<string>) => {
  return keys?.join(':');
};
