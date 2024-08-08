import { IBaseValueValidatorParams } from '@/components/providers/Validator/types';
import { ValueValidator } from '@/components/providers/Validator/value-validators/value-validator.abstract';

export interface IPatternValidatorParams extends IBaseValueValidatorParams {
  pattern: string;
}

export class PatternValueValidator extends ValueValidator<IPatternValidatorParams> {
  type = 'pattern';

  validate(value: unknown) {
    if (!new RegExp(this.params.pattern).test(value as string)) {
      throw new Error(this.getErrorMessage());
    }
  }

  private getErrorMessage() {
    if (!this.params.message)
      return `Value must match {pattern}.`.replace('{pattern}', this.params.pattern);

    return this.params.message.replace('{pattern}', this.params.pattern);
  }
}
