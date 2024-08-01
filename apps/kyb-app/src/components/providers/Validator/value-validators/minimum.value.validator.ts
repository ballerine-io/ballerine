import {
  IBaseValueValidatorParams,
  TMinimumValidationParams,
} from '@/components/providers/Validator/types';
import { ValueValidator } from '@/components/providers/Validator/value-validators/value-validator.abstract';

export interface IMinimumValueValidatorParams extends IBaseValueValidatorParams {
  minimum: number;
}

export class MinimumValueValidator extends ValueValidator<IMinimumValueValidatorParams> {
  validate<TValue extends number>(value: TValue): void {
    if (typeof value !== 'number' || value < this.params.minimum) {
      throw new Error(this.getErrorMessage());
    }
  }

  private getErrorMessage() {
    if (!this.params.message)
      return `Minimum value is {minimum}.`.replace('{minimum}', this.params.minimum.toString());

    return this.params.message.replace('{minimum}', this.params.minimum.toString());
  }

  static isMinimumParams = (params: unknown): params is TMinimumValidationParams => {
    if (typeof params === 'number') return true;

    //@ts-ignore
    if (
      Array.isArray(params) &&
      typeof params?.[0] === 'number' &&
      typeof params?.[1] === 'string'
    ) {
      return true;
    }

    return false;
  };
}
