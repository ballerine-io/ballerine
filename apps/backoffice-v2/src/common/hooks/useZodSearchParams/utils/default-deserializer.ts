import qs from 'qs';

export const defaultDeserializer = (searchParams: string) =>
  qs.parse(searchParams, { ignoreQueryPrefix: true });
