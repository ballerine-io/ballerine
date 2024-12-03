export type TBaseValidationRules = 'json-logic';

export interface IValidationRule {
  type: TBaseValidationRules;
  value: object;
}

export type TBaseValidators =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'minimum'
  | 'maximum';

export interface ICommonValidator<T = object, TValidatorType = TBaseValidators> {
  type: TValidatorType;
  value: T;
  message?: string;
  applyWhen?: IValidationRule;
}

export interface IValidationSchema {
  id: string;
  valueDestination?: string;
  validators: ICommonValidator[];
  children?: IValidationSchema[];
}

export interface IValidationError {
  id: string;
  originId: string;
  invalidValue: unknown;
  message: string[];
}

export * from '../hooks/internal/useValidatorRef/types';

export type TValidator<T, TValidatorParams = unknown> = (
  value: T,
  validator: ICommonValidator<TValidatorParams>,
) => void;

export type TDeepthLevelStack = number[];
