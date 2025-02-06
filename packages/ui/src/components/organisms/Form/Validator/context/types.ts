import { IValidationError } from '../types';

export interface IValidatorContext<TValues> {
  errors: IValidationError[];
  values: TValues;
  isValid: boolean;
  validate: () => Promise<IValidationError[]>;
}
