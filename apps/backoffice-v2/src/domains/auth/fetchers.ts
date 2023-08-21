import { ISignInProps } from './hooks/mutations/useSignInMutation/interfaces';
import { apiClient } from '../../common/api-client/api-client';
import { z } from 'zod';
import { handleZodError } from '../../common/utils/handle-zod-error/handle-zod-error';
import { Method } from '../../common/enums';
import { AuthenticatedUserSchema } from './validation-schemas';

export const fetchSignOut = async ({ callbackUrl }: ISignInProps) => {
  const [session, error] = await apiClient({
    endpoint: `auth/logout`,
    method: Method.POST,
    schema: z.any(),
    body: {
      callbackUrl,
    },
  });

  return handleZodError(error, session);
};

export const fetchSignIn = async ({ callbackUrl, body }: ISignInProps) => {
  const [session, error] = await apiClient({
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

  return handleZodError(error, session);
};

export const fetchAuthenticatedUser = async () => {
  const [session, error] = await apiClient({
    endpoint: `auth/session`,
    method: Method.GET,
    schema: z.object({
      user: AuthenticatedUserSchema,
    }),
  });

  return handleZodError(error, session);
};
