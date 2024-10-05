import { validatorContext } from '@/components/providers/Validator/validator.context';
import { useContext } from 'react';

export const useValidator = () => useContext(validatorContext);
