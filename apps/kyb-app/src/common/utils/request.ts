import { getAccessToken } from '@app/helpers/get-access-token.helper';
import ky from 'ky';

export const request = ky.extend({
  prefixUrl: import.meta.env.VITE_API_URL as string,
  hooks: {
    beforeRequest: [
      request => {
        request.headers.set('Authorization', `Bearer ${getAccessToken()}`);
      },
    ],
  },
});
