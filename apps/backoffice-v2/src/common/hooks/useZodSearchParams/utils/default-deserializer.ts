import qs from 'qs';
import { deepStringToNull } from './deep-string-to-null';

export const defaultDeserializer = (searchParams: string) => {
  const deserialized = qs.parse(searchParams, {
    ignoreQueryPrefix: true,
    strictNullHandling: true,
  });

  return deepStringToNull(deserialized);
};
