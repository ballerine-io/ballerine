import { z } from 'zod';
import { isErrorWithCode } from '@ballerine/common';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../../common/components/organisms/Form/Form';
import { Button } from '../../common/components/atoms/Button/Button';
import { Input } from '../../common/components/atoms/Input/Input';
import { Card } from '../../common/components/atoms/Card/Card';
import { BallerineLogo } from '../../common/components/atoms/icons';
import { useSignInMutation } from '../../domains/auth/hooks/mutations/useSignInMutation/useSignInMutation';
import { FunctionComponent, useCallback } from 'react';
import { useAuthContext } from '../../domains/auth/context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useIsAuthenticated } from '../../domains/auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { CardHeader } from '../../common/components/atoms/Card/Card.Header';
import { CardContent } from '../../common/components/atoms/Card/Card.Content';
import { FormField } from '../../common/components/organisms/Form/Form.Field';
import { FormItem } from '../../common/components/organisms/Form/Form.Item';
import { FormLabel } from '../../common/components/organisms/Form/Form.Label';
import { FormControl } from '../../common/components/organisms/Form/Form.Control';
import { FormMessage } from '../../common/components/organisms/Form/Form.Message';
import { env } from '../../common/env/env';
import { ErrorAlert } from '../../common/components/atoms/ErrorAlert/ErrorAlert';
import { FullScreenLoader } from '../../common/components/molecules/FullScreenLoader/FullScreenLoader';

export const SignIn: FunctionComponent = () => {
  const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string(),
  });
  const { mutate: signIn, error } = useSignInMutation();
  const { signInOptions } = useAuthContext();
  const onSignIn = useCallback(
    body => {
      return signIn({
        redirect: signInOptions?.redirect,
        callbackUrl: signInOptions?.callbackUrl,
        body,
      });
    },
    [signInOptions?.redirect, signInOptions?.callbackUrl, signIn],
  );
  const onSubmit: SubmitHandler<z.infer<typeof SignInSchema>> = useCallback(
    data => {
      return onSignIn(data);
    },
    [onSignIn],
  );
  const isAuthenticated = useIsAuthenticated();
  const signInForm = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Handles a flash of content on sign in
  if (isAuthenticated) return <FullScreenLoader />;

  return (
    <section className={`flex h-full flex-col items-center justify-center`}>
      <div className={`mb-16`}>
        {env.VITE_IMAGE_LOGO_URL ? (
          <img className={`w-40`} src={env.VITE_IMAGE_LOGO_URL} />
        ) : (
          <BallerineLogo />
        )}
      </div>
      <Card className={`w-full max-w-lg`}>
        <CardHeader className={`mb-2 text-center text-4xl font-bold`}>Sign In</CardHeader>
        <CardContent>
          {isErrorWithCode(error) && error?.code === 401 && (
            <ErrorAlert>Invalid credentials</ErrorAlert>
          )}
          <Form {...signInForm}>
            <form onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={signInForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input required type={'email'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={signInForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input required type={'password'} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className={`flex justify-end`}>
                <Button type="submit" className={`ms-auto mt-3`}>
                  Sign In
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </section>
  );
};
