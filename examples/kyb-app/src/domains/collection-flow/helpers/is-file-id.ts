import { isCuid } from '@paralleldrive/cuid2';

export const isFileId = (str: unknown): str is string =>
  typeof str === 'string' ? isCuid(str) : false;
