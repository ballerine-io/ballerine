import {
  IBaseValueValidatorParams,
  TMaximumValidationParams,
} from '@/components/providers/Validator/types';
import { ValueValidator } from '@/components/providers/Validator/value-validators/value-validator.abstract';

export interface IMaximumValueValidatorParams extends IBaseValueValidatorParams {
  maximum: number;
}

export class MaximumValueValidator extends ValueValidator<IMaximumValueValidatorParams> {
  type = 'maximum';

  validate<TValue extends number>(value: TValue): void {
    if (typeof value !== 'number' || value > this.params.maximum) {
      throw new Error(this.getErrorMessage());
    }
  }

  private getErrorMessage() {
    if (!this.params.message)
      return `Maximum value is {maximum}.`.replace('{maximum}', this.params.maximum.toString());

    return this.params.message.replace('{maximum}', this.params.maximum.toString());
  }

  static isMaximumParams = (params: unknown): params is TMaximumValidationParams => {
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
