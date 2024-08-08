import { IBaseValueValidatorParams } from '@/components/providers/Validator/types';
import { ValueValidator } from '@/components/providers/Validator/value-validators/value-validator.abstract';

export interface IMinimumValueValidatorParams extends IBaseValueValidatorParams {
  minimum: number;
}

export class MinimumValueValidator extends ValueValidator<IMinimumValueValidatorParams> {
  type = 'minimum';

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
}
