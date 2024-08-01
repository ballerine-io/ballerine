import {
  IBaseValueValidatorParams,
  TFormats,
  TFormatValidationParams,
} from '@/components/providers/Validator/types';
import { ValueValidator } from '@/components/providers/Validator/value-validators/value-validator.abstract';
import EmailValidator from 'email-validator';

export interface IFormatValueValidatorParams extends IBaseValueValidatorParams {
  format: TFormats;
}

export class FormatValueValidator extends ValueValidator<IFormatValueValidatorParams> {
  validate(value: unknown): void {
    if (this.params.format === 'email') {
      if (!EmailValidator.validate(value as string)) {
        throw new Error(this.getErrorMessage());
      }

      return;
    }

    throw new Error(`Format ${this.params.format} is not supported.`);
  }

  private getErrorMessage() {
    if (!this.params.message) return 'Invalid format.';

    return this.params.message.replace('{format}', this.params.format.toString());
  }

  static isFormatParams = (params: unknown): params is TFormatValidationParams => {
    if (typeof params === 'string') return true;

    //@ts-ignore
    if (
      Array.isArray(params) &&
      typeof params?.[0] === 'string' &&
      typeof params?.[1] === 'string'
    ) {
      return true;
    }

    return false;
  };
}
