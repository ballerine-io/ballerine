export type TValidatorErrorMessage = string;

export type TRequiredValidationParams = boolean | [boolean, TValidatorErrorMessage];

export type TValidationParams = TRequiredValidationParams;

export type TValidators = 'required';

export interface UIElementV2<TFieldParams = any> {
  id: string;
  field: string;
  type: 'ui' | 'input';
  validation: Record<TValidators, TValidationParams>;
  params: TFieldParams;
}
