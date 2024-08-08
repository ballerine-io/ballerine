import { IBaseValueValidatorParams } from '@/components/providers/Validator/types';
import { ValueValidator } from '@/components/providers/Validator/value-validators/value-validator.abstract';

export interface IRequiredValueValidatorParams extends IBaseValueValidatorParams {
  required: boolean;
}

export class RequiredValueValidator extends ValueValidator<IRequiredValueValidatorParams> {
  type = 'required';

  validate(value: unknown) {
    if (value === undefined || value === null || value === '') {
      throw new Error(this.getErrorMessage());
    }
  }

  private getErrorMessage() {
    if (!this.params.message) return `Value is required.`;

    return this.params.message;
  }
}
