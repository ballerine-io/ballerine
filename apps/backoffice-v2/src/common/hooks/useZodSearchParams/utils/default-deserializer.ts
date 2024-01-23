import qs from 'qs';
import { parseNullAndEmptyArrayDeep } from './parse-null-and-empty-array-deep';
import { IUseZodSearchParams } from '../interfaces';

export const defaultDeserializer: NonNullable<IUseZodSearchParams['deserializer']> = (
  searchParams: string,
) => {
  const parsedSearchParams = qs.parse(searchParams, {
    ignoreQueryPrefix: true,
    strictNullHandling: true,
  });

  // Otherwise `qs` omits null and empty arrays.
  return parseNullAndEmptyArrayDeep(parsedSearchParams);
};
