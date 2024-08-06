export type TFormats = 'email';

export type TValidatorErrorMessage = string;

export type TValidatorApplyRule = object;

export type TRequiredValidationParams =
  | boolean
  | [boolean, TValidatorErrorMessage]
  | [boolean, TValidatorErrorMessage, TValidatorApplyRule];

export type TMinLengthValidationParams =
  | number
  | [number, TValidatorErrorMessage]
  | [number, TValidatorErrorMessage, TValidatorApplyRule];

export type TMaxLengthValidationParams =
  | number
  | [number, TValidatorErrorMessage]
  | [number, TValidatorErrorMessage, TValidatorApplyRule];

export type TPatternValidationParams =
  | string
  | [string, TValidatorErrorMessage]
  | [string, TValidatorErrorMessage, TValidatorApplyRule];

export type TMinimumValidationParams =
  | number
  | [number, TValidatorErrorMessage]
  | [number, TValidatorErrorMessage, TValidatorApplyRule];

export type TMaximumValidationParams =
  | number
  | [number, TValidatorErrorMessage]
  | [number, TValidatorErrorMessage, TValidatorApplyRule];

export type TFormatValidationParams =
  | TFormats
  | [TFormats, TValidatorErrorMessage]
  | [TFormats, TValidatorErrorMessage, TValidatorApplyRule];

export type TValidationParams =
  | TRequiredValidationParams
  | TMinLengthValidationParams
  | TMaxLengthValidationParams
  | TPatternValidationParams
  | TMinimumValidationParams
  | TMaximumValidationParams
  | TFormatValidationParams;

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
  applyRule?: TValidatorApplyRule;
}
