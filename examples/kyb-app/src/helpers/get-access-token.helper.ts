import qs from 'qs';

export const getAccessToken = (tokenKey = 'token'): string | null => {
  const query = qs.parse(window.location.search, { ignoreQueryPrefix: true });

  return query[tokenKey] ? (query[tokenKey] as string) || null : null;
};
