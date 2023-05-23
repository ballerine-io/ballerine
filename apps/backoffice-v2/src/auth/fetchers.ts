import { ISignInProps } from './hooks/mutations/useSignInMutation/interfaces';
import { apiClient } from '../api/api-client';
import { z } from 'zod';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';
import { Method } from '../enums';
import { AuthenticatedUserSchema } from './validation-schemas';

export const fetchSignOut = async ({ callbackUrl }: ISignInProps) => {
  const [data, error] = await apiClient({
    endpoint: `auth/logout`,
    method: Method.POST,
    schema: z.any(),
    body: {
      callbackUrl,
    },
  });

  return handleZodError(error, data);
};

export const fetchSignIn = async ({ callbackUrl, body }: ISignInProps) => {
  const [data, error] = await apiClient({
    endpoint: 'auth/login',
    method: Method.POST,
    schema: z.any(),
    body: {
      ...body,
      callbackUrl,
    },
    options: {
      headers: {
        /**
         * Make sure headers like Authorization or credentials
         * set in {@link apiClient} don't get in the way if the
         * sign in route uses a different authentication method
         * or doesn't use one.
         */
        // Authorization: `Bearer ${token}`,
      },
    },
  });

  return handleZodError(error, data);
};

export const fetchAuthenticatedUser = async () => {
  const [data, error] = await apiClient({
    endpoint: `auth/session`,
    method: Method.GET,
    schema: z.object({
      user: AuthenticatedUserSchema,
    }),
  });

  return handleZodError(error, data);
};
