import { AnyRecord } from '../../types';

export const isObjectEmpty = (obj: AnyRecord) => {
  return Object.keys(obj).length === 0;
};
