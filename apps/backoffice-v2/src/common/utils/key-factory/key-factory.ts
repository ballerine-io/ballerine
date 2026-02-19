export const keyFactory = (...keys: string[]) => {
  return keys?.join(':');
};
