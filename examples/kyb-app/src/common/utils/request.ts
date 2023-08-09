import ky from 'ky';

export const request = ky.extend({
  prefixUrl: import.meta.env.VITE_API_URL as string,
});
