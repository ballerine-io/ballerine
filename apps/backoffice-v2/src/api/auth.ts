import { ISignInProps } from '../lib/react-query/mutations/useSignInMutation/interfaces';

export const auth = {
  // signIn: async ({ callbackUrl, provider }: ISignInProps) => {
  //   const [data, error] = await apiClient({
  //     endpoint: endpoints.auth.signIn[provider].endpoint(),
  //     method: endpoints.auth.signIn[provider].method,
  //     schema: z.any(),
  //     body: {
  //       callbackUrl,
  //     },
  //     options: {
  //       headers: {
  //         /**
  //          * Make sure headers like Authorization or credentials
  //          * set in {@link apiClient} don't get in the way if the
  //          * sign in route uses a different authentication method
  //          * or doesn't use one.
  //          */
  //         // Authorization: `Bearer ${token}`,
  //       },
  //     },
  //   });
  //
  //   return handleZodError(error, data);
  // },
  signIn: async ({ callbackUrl, provider }: ISignInProps) => ({}),
  // signOut: async ({ callbackUrl }: ISignInProps) => {
  //   const [data, error] = await apiClient({
  //     endpoint: endpoints.auth.signOut.endpoint(),
  //     method: endpoints.auth.signOut.method,
  //     schema: z.any(),
  //     body: {
  //       callbackUrl,
  //     },
  //   });
  //
  //   return handleZodError(error, data);
  // },
  signOut: async ({ callbackUrl }: ISignInProps) => ({}),
  getSession: async () => {
    return Promise.resolve({ session: false });
    // const [data, error] = await apiClient({
    //   endpoint: endpoints.auth.getSession.endpoint(),
    //   method: endpoints.auth.getSession.method,
    //   schema: z.object({
    //     session: z.boolean(),
    //   }),
    // });

    // return handleZodError(error, data);
  },
};
