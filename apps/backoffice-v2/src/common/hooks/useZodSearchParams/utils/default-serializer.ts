import qs from 'qs';

export const defaultSerializer = (searchParams: Record<string, unknown>) =>
  qs.stringify(searchParams, { encode: false, addQueryPrefix: true });
