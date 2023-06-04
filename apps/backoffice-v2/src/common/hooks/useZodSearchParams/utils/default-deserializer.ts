import qs from 'qs';

export const defaultDeserializer = (searchParams: string) => {
  return qs.parse(searchParams, {
    ignoreQueryPrefix: true,
    strictNullHandling: true,
  });
};
