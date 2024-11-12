import { ITheme } from '@/common/types/settings';
import { FunctionComponent } from 'react';
import { SignupLayoutProvider } from './context/SignupLayoutProvider';

interface ISignupProps {
  children: React.ReactNode;
  themeParams?: NonNullable<ITheme['signup']>;
}

export const Signup: FunctionComponent<ISignupProps> = ({ children, themeParams }) => {
  return (
    <SignupLayoutProvider themeParams={themeParams}>
      {children}
      <div className="flex min-h-screen w-full flex-row flex-nowrap">{children}</div>
    </SignupLayoutProvider>
  );
};
