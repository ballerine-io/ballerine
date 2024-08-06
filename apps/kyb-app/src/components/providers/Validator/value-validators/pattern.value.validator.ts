import {
  IBaseValueValidatorParams,
  TPatternValidationParams,
} from '@/components/providers/Validator/types';
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

  static isPatternParams = (params: unknown): params is TPatternValidationParams => {
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
