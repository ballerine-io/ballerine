import { FunctionComponent } from 'react';
import { SignUpFormContext } from './signup-form-context';

interface ISignUpFormProviderProps {
  children: React.ReactNode;
  context: {
    isLoading: boolean;
    isSuccess: boolean;
  };
}

export const SignUpFormProvider: FunctionComponent<ISignUpFormProviderProps> = ({
  children,
  context,
}) => {
  return <SignUpFormContext.Provider value={context}>{children}</SignUpFormContext.Provider>;
};
