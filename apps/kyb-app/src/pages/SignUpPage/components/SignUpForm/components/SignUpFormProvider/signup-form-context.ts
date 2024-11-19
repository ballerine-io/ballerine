import { createContext } from 'react';

export const SignUpFormContext = createContext<{
  isLoading: boolean;
  isSuccess: boolean;
}>({
  isLoading: false,
  isSuccess: false,
});
