export type TValidatorErrorMessage = string;

export type TRequiredValidationParams = boolean | [boolean, TValidatorErrorMessage];

export type TMinLengthValidationParams = number | [number, TValidatorErrorMessage];

export type TMaxLengthValidationParams = number | [number, TValidatorErrorMessage];

export type TPatternValidationParams = string | [string, TValidatorErrorMessage];

export type TMinimumValidationParams = number | [number, TValidatorErrorMessage];

export type TMaximumValidationParams = number | [number, TValidatorErrorMessage];

export type TValidationParams =
  | TRequiredValidationParams
  | TMinLengthValidationParams
  | TMaxLengthValidationParams
  | TPatternValidationParams
  | TMinimumValidationParams
  | TMaximumValidationParams;

export type TValidators =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'minimum'
  | 'maximum';

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
}
