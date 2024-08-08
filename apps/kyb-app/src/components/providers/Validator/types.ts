import { IFormatValueValidatorParams } from '@/components/providers/Validator/value-validators/format.value.validator';
import { IMaxLengthValueValidatorParams } from '@/components/providers/Validator/value-validators/max-length.value.validator';
import { IMaximumValueValidatorParams } from '@/components/providers/Validator/value-validators/maximum.value.validator';
import { IMinLengthValueValidatorParams } from '@/components/providers/Validator/value-validators/min-length.value.validator';
import { IPatternValidatorParams } from '@/components/providers/Validator/value-validators/pattern.value.validator';
import { IRequiredValueValidatorParams } from '@/components/providers/Validator/value-validators/required.value-validator';
import { Rule } from '@/domains/collection-flow';

export type TFormats = 'email';

export type TValidatorErrorMessage = string;

export type TValidatorApplyRule = object;

export type TValidationParams =
  | IFormatValueValidatorParams
  | IMaxLengthValueValidatorParams
  | IMinLengthValueValidatorParams
  | IMaximumValueValidatorParams
  | IMinLengthValueValidatorParams
  | IRequiredValueValidatorParams
  | IPatternValidatorParams;

export type TValidators =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'minimum'
  | 'maximum'
  | 'format';

export interface IBaseFieldParams {
  label?: string;
  placeholder?: string;
  stack?: number[];
}

export interface UIElementV2<TFieldParams = IBaseFieldParams> {
  id: string;
  element: string;
  type: 'ui' | 'field' | 'field-list';
  validation: Partial<Record<TValidators, TValidationParams>>;
  params?: TFieldParams;
  valueDestination: string;
  children?: UIElementV2[];
}

export interface IBaseValueValidatorParams {
  message?: string;
  applyWhen?: Rule[];
}
