import { ITheme } from '@/common/types/settings';
import { FunctionComponent } from 'react';
import { SignupLayoutContext } from './signup-layout.context';

interface ISignupLayoutProviderProps {
  children: React.ReactNode;
  themeParams?: NonNullable<ITheme['signup']>;
}

export const SignupLayoutProvider: FunctionComponent<ISignupLayoutProviderProps> = ({
  children,
  themeParams,
}) => {
  return (
    <SignupLayoutContext.Provider value={{ themeParams }}>{children}</SignupLayoutContext.Provider>
  );
};
