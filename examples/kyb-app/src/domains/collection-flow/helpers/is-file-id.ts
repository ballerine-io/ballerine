import { isCuid } from '@app/common/utils/is-cuid';

export const isFileId = (str: unknown): str is string => isCuid(str);
