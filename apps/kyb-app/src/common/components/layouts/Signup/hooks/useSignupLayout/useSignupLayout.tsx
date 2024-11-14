import { useContext } from 'react';
import { ISignupLayoutContext, SignupLayoutContext } from '../../context/SignupLayoutProvider';

export const useSignupLayout = (): ISignupLayoutContext => {
  const context = useContext(SignupLayoutContext);

  if (!context) {
    throw new Error('useSignupLayout must be used within a SignupLayoutProvider');
  }

  return context;
};
