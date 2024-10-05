import { IDocumentValueValidatorParams } from '@/components/providers/Validator/value-validators/document.value.validator';
import { IFormatValueValidatorParams } from '@/components/providers/Validator/value-validators/format.value.validator';
import { IMaxLengthValueValidatorParams } from '@/components/providers/Validator/value-validators/max-length.value.validator';
import { IMaximumValueValidatorParams } from '@/components/providers/Validator/value-validators/maximum.value.validator';
import { IMinLengthValueValidatorParams } from '@/components/providers/Validator/value-validators/min-length.value.validator';
import { IPatternValidatorParams } from '@/components/providers/Validator/value-validators/pattern.value.validator';
import { IRequiredValueValidatorParams } from '@/components/providers/Validator/value-validators/required.value-validator';
import { Rule } from '@/domains/collection-flow';
import { AnyObject } from '@ballerine/ui';

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
  | IPatternValidatorParams
  | IDocumentValueValidatorParams;

export type TValidators =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'minimum'
  | 'maximum'
  | 'format'
  | 'document';

export interface IBaseFieldParams {
  label?: string;
  placeholder?: string;
  stack?: number[];
}

export interface UIElementV2<TFieldParams = IBaseFieldParams> {
  id: string;
  element: string;
  validation: Partial<Record<TValidators, TValidationParams>>;
  options?: TFieldParams;
  valueDestination: string;
  children?: UIElementV2[];

  availableOn?: Rule[];
  visibleOn?: Rule[];
}

export interface IBaseValueValidatorParams {
  message?: string;
  applyWhen?: Rule[];
}

export interface IFieldContext {
  context: AnyObject;
  stack: number[];
}
