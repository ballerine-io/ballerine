import { IBaseValueValidatorParams } from '@/components/providers/Validator/types';
import { ValueValidator } from '@/components/providers/Validator/value-validators/value-validator.abstract';

export interface IMaxLengthValueValidatorParams extends IBaseValueValidatorParams {
  maxLength: number;
}

export class MaxLengthValueValidator extends ValueValidator<IMaxLengthValueValidatorParams> {
  type = 'maxLength';

  validate<TValue extends { length?: number }>(value: TValue): void {
    if (value?.length === undefined || value.length > this.params.maxLength) {
      throw new Error(this.getErrorMessage());
    }
  }

  private getErrorMessage() {
    if (!this.params.message)
      return `Maximum length is {maxLength}.`.replace(
        '{maxLength}',
        this.params.maxLength.toString(),
      );

    return this.params.message.replace('{maxLength}', this.params.maxLength.toString());
  }
}
