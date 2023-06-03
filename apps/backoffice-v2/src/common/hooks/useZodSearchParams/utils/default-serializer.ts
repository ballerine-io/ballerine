import qs from 'qs';
import { deepNullToString } from './deep-null-to-string';

export const defaultSerializer = (searchParams: Record<string, unknown>) =>
  qs.stringify(deepNullToString(searchParams), {
    encode: false,
    addQueryPrefix: true,
    strictNullHandling: true,
    skipNulls: false,
  });
