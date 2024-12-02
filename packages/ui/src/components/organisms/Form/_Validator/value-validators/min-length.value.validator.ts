import { ValueValidator } from '@/components/providers/Validator/value-validators/value-validator.abstract';
import { IBaseValueValidatorParams } from '../types';

export interface IMinLengthValueValidatorParams extends IBaseValueValidatorParams {
  minLength: number;
}

export class MinLengthValueValidator extends ValueValidator<IMinLengthValueValidatorParams> {
  type = 'minLength';

  validate<TValue extends { length?: number }>(value: TValue): void {
    if (value?.length === undefined || value.length < this.params.minLength) {
      throw new Error(this.getErrorMessage());
    }
  }

  private getErrorMessage() {
    if (!this.params.message)
      return `Minimum length is {minLength}.`.replace(
        '{minLength}',
        this.params.minLength.toString(),
      );

    return this.params.message.replace('{minLength}', this.params.minLength.toString());
  }
}
