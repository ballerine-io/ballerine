import { delay } from '@app/common/utils/delay';
import { SigninCredentials, useSignin } from '@app/hooks/useSignin';
import { SigninLayout } from '@app/pages/SignIn/components/layouts/SigninLayout';
import { SigninForm } from '@app/pages/SignIn/components/organisms/SigninForm';
import { useCallback, useState } from 'react';
import { Navigate } from 'react-router-dom';

export const SignIn = () => {
  const { user, signin } = useSignin();

  const [isLoading, setLoading] = useState(false);

  const handleSubmit = useCallback(
    async (credentials: SigninCredentials) => {
      setLoading(true);
      // Simulating some background processes to make it look fancy :)
      await delay(1000);
      setLoading(false);
      signin(credentials);
    },
    [signin],
  );

  if (user) {
    return <Navigate to={'/collection-flow'} />;
  }

  return (
    <SigninLayout bgSrc="/public/signin-background.png">
      <div className="flex flex-col items-center md:items-start">
        <div>
          <div className="mb-12">
            <img src={'/public/app-logo.svg'} className="h-[51px] max-w-[120px]" />
          </div>
          <div className="mb-6">
            <h1 className="font-inter mb-6 text-2xl font-bold">Activate your account</h1>
            <h2 className="max-w-[303px] text-base leading-5">
              Activate your account with PayLynk by completing the verification process.
            </h2>
          </div>
          <div className="mb-6">
            <SigninForm isLoading={isLoading} onSubmit={handleSubmit} />
          </div>
          <div>
            <p className="text-muted-foreground color-[#94A3B8] text-base leading-6">
              Contact PayLynk for support
              <br /> example@example.com
              <br /> (000) 123-4567
            </p>
          </div>
        </div>
      </div>
    </SigninLayout>
  );
};
