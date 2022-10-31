import { isObjectEmpty } from './object-utils';

export const resolveStringTemplate = (str: string, obj?: StringKV) => {
  if (!obj || isObjectEmpty(obj)) return str;
  return str.replace(/\${(.*?)}/g, (x, g: string) => obj[g]);
};
