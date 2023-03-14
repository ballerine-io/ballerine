import { isEmptyObject } from '@ballerine/common';

export const resolveStringTemplate = (str: string, obj?: StringKV) => {
  // @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-return
  if (!obj || isEmptyObject(obj)) return str;
  return str.replace(/\${(.*?)}/g, (x, g: string) => obj[g]);
};
