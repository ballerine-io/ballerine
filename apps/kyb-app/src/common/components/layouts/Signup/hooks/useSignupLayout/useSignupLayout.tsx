import { useContext } from 'react';
import { SignupLayoutContext } from '../../context/SignupLayoutProvider';

export const useSignupLayout = () => {
  const { themeParams } = useContext(SignupLayoutContext);

  return { themeParams };
};
