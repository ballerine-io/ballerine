import { AnyRecord } from '@/types';

export const uniqueArrayOfObjects = <TItem extends AnyRecord>(
  array: Array<TItem>,
  uniqueKeys: Array<keyof TItem>,
) => {
  const uniqueMap = new Map();
  array.forEach(item => {
    const compositeKey = uniqueKeys.map(key => item[key]).join('|');
    if (!uniqueMap.has(compositeKey)) {
      uniqueMap.set(compositeKey, item);
    }
  });

  return Array.from(uniqueMap.values());
};
