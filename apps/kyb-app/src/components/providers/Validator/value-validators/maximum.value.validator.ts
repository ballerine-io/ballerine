import { IBaseValueValidatorParams } from '@/components/providers/Validator/types';
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
}
