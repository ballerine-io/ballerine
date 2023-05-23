import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from 'components/organisms/Form/Form';
import { Button } from 'components/atoms/Button/button';
import { Input } from 'components/atoms/Input/Input';
import { Card, CardContent, CardHeader } from 'components/atoms/Card/card';
import { BallerineLogo } from 'components/atoms/icons';
import { Alert } from 'components/atoms/Alert/Alert';
import { AlertCircle } from 'lucide-react';
import { AlertDescription } from 'components/atoms/Alert/Alert.Description';
import { AlertTitle } from 'components/atoms/Alert/Alert.Title';
import { useSignInMutation } from '../../auth/hooks/mutations/useSignInMutation/useSignInMutation';
import { FormEventHandler, useCallback } from 'react';
import { useAuthContext } from '../../auth/context/AuthProvider/hooks/useAuthContext/useAuthContext';
import { useIsAuthenticated } from '../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';
import { isErrorWithMessage } from '@ballerine/common';
import { isErrorWithCode } from '../../lib/react-query/query-client';

export const SignIn = () => {
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
  });

  if (isAuthenticated) return null;

  return (
    <section className={`flex h-full flex-col items-center justify-center`}>
      <div className={`mb-16`}>
        <BallerineLogo />
      </div>
      <Card className={`w-full max-w-lg`}>
        <CardHeader className={`mb-2 text-center text-4xl font-bold`}>Sign In</CardHeader>
        <CardContent>
          {isErrorWithCode(error) && error?.code === 401 && (
            <Alert className={`mb-8`} variant={`destructive`}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Invalid credentials</AlertDescription>
            </Alert>
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
