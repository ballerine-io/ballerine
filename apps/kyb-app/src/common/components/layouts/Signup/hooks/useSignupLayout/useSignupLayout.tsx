import { useContext } from 'react';
import { SignupLayoutContext } from '../../context/SignupLayoutProvider';

export const useSignupLayout = () => {
  const context = useContext(SignupLayoutContext);

  if (!context) {
    throw new Error('useSignupLayout must be used within a SignupLayoutProvider');
  }

  return { themeParams: context.themeParams };
};
