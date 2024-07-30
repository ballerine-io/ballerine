import { IBaseValueValidatorParams } from '@/components/providers/Validator/types';
import { MaxLengthValueValidator } from '@/components/providers/Validator/value-validators/max-length.value.validator';
import { MinLengthValueValidator } from '@/components/providers/Validator/value-validators/min-length.value.validator';
import { RequiredValueValidator } from '@/components/providers/Validator/value-validators/required.value-validator';

const validatorsMap = {
  required: RequiredValueValidator,
  minLength: MinLengthValueValidator,
  maxLength: MaxLengthValueValidator,
};

export type TValidator = keyof typeof validatorsMap;

export class ValueValidatorManager {
  constructor(readonly validators: typeof validatorsMap = validatorsMap) {}

  validate<TValidatorParams extends IBaseValueValidatorParams>(
    value: unknown,
    key: TValidator,
    params: TValidatorParams,
  ) {
    const validator = new this.validators[key](params as any);
    return validator.validate(value as any);
  }
}
