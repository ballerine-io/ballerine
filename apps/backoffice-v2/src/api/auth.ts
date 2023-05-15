import { ISignInProps } from '../lib/react-query/mutations/useSignInMutation/interfaces';
import { handleZodError } from '../utils/handle-zod-error/handle-zod-error';
import { endpoints } from './endpoints';
import { apiClient } from './api-client';
import { z } from 'zod';
import {AuthenticatedUserSchema} from "../lib/zod/schemas/authenticated-user";

export const auth = {
  signIn: async ({ callbackUrl, provider, body }: ISignInProps) => {
    const [data, error] = await apiClient({
      endpoint: endpoints.auth.signIn[provider].endpoint(),
      method: endpoints.auth.signIn[provider].method,
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
  },
  signOut: async ({ callbackUrl }: ISignInProps) => {
    const [data, error] = await apiClient({
      endpoint: endpoints.auth.signOut.endpoint(),
      method: endpoints.auth.signOut.method,
      schema: z.any(),
      body: {
        callbackUrl,
      },
    });

    return handleZodError(error, data);
  },
  getSession: async () => {
    const [data, error] = await apiClient({
      endpoint: endpoints.auth.getSession.endpoint(),
      method: endpoints.auth.getSession.method,
      schema: z.object({
        user: AuthenticatedUserSchema,
      }),
    });

    return handleZodError(error, data);
  },
};
