import { isEmptyObject } from '@ballerine/common';

export const resolveStringTemplate = (str: string, obj?: StringKV) => {
  if (!obj || isEmptyObject(obj)) return str;
  return str.replace(/\${(.*?)}/g, (x, g: string) => obj[g]);
};
