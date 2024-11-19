import { useContext } from 'react';
import { SignUpFormContext } from '../../signup-form-context';

export const useSignupForm = () => useContext(SignUpFormContext);
