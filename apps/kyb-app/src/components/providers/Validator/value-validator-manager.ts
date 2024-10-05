import { IBaseValueValidatorParams, IFieldContext } from '@/components/providers/Validator/types';
import { DocumentValueValidator } from '@/components/providers/Validator/value-validators/document.value.validator';
import { FormatValueValidator } from '@/components/providers/Validator/value-validators/format.value.validator';
import { MaxLengthValueValidator } from '@/components/providers/Validator/value-validators/max-length.value.validator';
import { MaximumValueValidator } from '@/components/providers/Validator/value-validators/maximum.value.validator';
import { MinLengthValueValidator } from '@/components/providers/Validator/value-validators/min-length.value.validator';
import { MinimumValueValidator } from '@/components/providers/Validator/value-validators/minimum.value.validator';
import { PatternValueValidator } from '@/components/providers/Validator/value-validators/pattern.value.validator';
import { RequiredValueValidator } from '@/components/providers/Validator/value-validators/required.value-validator';

const validatorsMap = {
  required: RequiredValueValidator,
  minLength: MinLengthValueValidator,
  maxLength: MaxLengthValueValidator,
  pattern: PatternValueValidator,
  minimum: MinimumValueValidator,
  maximum: MaximumValueValidator,
  format: FormatValueValidator,
  document: DocumentValueValidator,
};

export type TValidator = keyof typeof validatorsMap;

export class ValueValidatorManager {
  constructor(readonly validators: typeof validatorsMap = validatorsMap) {}

  validate<TValidatorParams extends IBaseValueValidatorParams>(
    value: unknown,
    key: TValidator,
    params: TValidatorParams,
    fieldContext: IFieldContext,
  ) {
    const validator = new this.validators[key](params as any);
    //@ts-ignore
    return validator.validate(value, fieldContext);
  }
}
