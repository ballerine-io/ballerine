import ky from 'ky';

export const request = ky.extend({
  prefixUrl: import.meta.env.VITE_API_URL as string,
  timeout: 10000,
  hooks: {
    beforeRequest: [
      request => {
        request.headers.set('Authorization', `Bearer ${import.meta.env.VITE_API_KEY as string}`);
      },
    ],
  },
});
