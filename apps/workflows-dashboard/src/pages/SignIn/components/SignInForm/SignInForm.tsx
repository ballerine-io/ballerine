import { Button } from '@/components/atoms/Button';
import { Card, CardContent, CardHeader } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Form } from '@/components/organisms/Form/Form';
import { FormControl } from '@/components/organisms/Form/Form.Control';
import { FormField } from '@/components/organisms/Form/Form.Field';
import { FormItem } from '@/components/organisms/Form/Form.Item';
import { FormLabel } from '@/components/organisms/Form/Form.Label';
import { FormMessage } from '@/components/organisms/Form/Form.Message';
import { SignInFormValues } from '@/pages/SignIn/components/SignInForm/types';
import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import { FormErrorAlert } from '@/pages/SignIn/components/SignInForm/ErrorAlert';

interface Props {
  isSubmitting: boolean;
  alert?: React.ReactNode;
  onSubmit: (values: SignInFormValues) => void;
}

export function SignInForm({ isSubmitting, alert = null, onSubmit }: Props) {
  const form = useForm<SignInFormValues>();

  return (
    <Card className={`w-full max-w-lg`}>
      <CardHeader className={`mb-2 text-center text-4xl font-bold`}>Sign In</CardHeader>
      <CardContent>
        {alert}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
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
              control={form.control}
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
              <Button
                type="submit"
                className={classnames(`ms-auto mt-3`, {
                  ['opacity-50']: isSubmitting,
                  ['pointer-events-none']: isSubmitting,
                })}
              >
                Sign In
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

SignInForm.ErrorAlert = FormErrorAlert;
