import { IValidationError } from './types';

export const checkIfValid = (errors: IValidationError[]) => errors.length === 0;
