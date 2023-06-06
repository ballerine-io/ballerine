import qs from 'qs';
import { stringifyNullAndEmptyArrayDeep } from './stringify-null-and-empty-array-deep';

export const defaultSerializer = (searchParams: Record<string, unknown>) => {
  const withNullAndEmptyArray = stringifyNullAndEmptyArrayDeep(searchParams);

  return qs.stringify(withNullAndEmptyArray, {
    encode: false,
    addQueryPrefix: true,
    strictNullHandling: true,
  });
};
