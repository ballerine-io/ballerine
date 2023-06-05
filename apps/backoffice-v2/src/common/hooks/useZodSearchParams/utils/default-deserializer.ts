import qs from 'qs';
import { parseNullAndEmptyArrayDeep } from './parse-null-and-empty-array-deep';

export const defaultDeserializer = (searchParams: string) => {
  const parsedSearchParams = qs.parse(searchParams, {
    ignoreQueryPrefix: true,
    strictNullHandling: true,
  });

  // Otherwise `qs` omits null and empty arrays.
  return parseNullAndEmptyArrayDeep(parsedSearchParams);
};
