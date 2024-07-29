import { ValueValidator } from '@/components/providers/Validator/value-validators/value-validator.abstract';
import { IBaseValueValidatorParams, TMinLengthValidationParams } from '../types';

export interface IMinLengthValueValidatorParams extends IBaseValueValidatorParams {
  minLength: number;
}

export class MinLengthValueValidator extends ValueValidator<IMinLengthValueValidatorParams> {
  validate<TValue extends { length?: number }>(value: TValue): void {
    if (value?.length === undefined || value.length < this.params.minLength) {
      throw new Error(this.params.message);
    }
  }

  static isMinLengthParams = (params: unknown): params is TMinLengthValidationParams => {
    if (typeof params === 'boolean') return true;

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
