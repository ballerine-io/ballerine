import { isEmptyObject } from '@ballerine/common';

export const resolveStringTemplate = (str: string, obj?: StringKV) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  if (!obj || isEmptyObject(obj)) return str;
  return str.replace(/\${(.*?)}/g, (x, g: string) => obj[g]);
};
