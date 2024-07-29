export type TValidatorErrorMessage = string;

export type TRequiredValidationParams = boolean | [boolean, TValidatorErrorMessage];

export type TMinLengthValidationParams = number | [number, TValidatorErrorMessage];

export type TValidationParams = TRequiredValidationParams | TMinLengthValidationParams;

export type TValidators = 'required' | 'minLength';

export interface IBaseFieldParams {}

export interface UIElementV2<TFieldParams = IBaseFieldParams> {
  id: string;
  field: string;
  type: 'ui' | 'field' | 'field-list';
  validation: Partial<Record<TValidators, TValidationParams>>;
  params?: TFieldParams;
  valueDestination: string;
  children?: UIElementV2[];
}

export interface IBaseValueValidatorParams {
  message: string;
}
