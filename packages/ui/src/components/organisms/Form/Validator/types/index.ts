export type TBaseValidationRules = 'json-logic';

export interface IValidationRule {
  engine: TBaseValidationRules;
  value: object;
}

export type TBaseValidators =
  | 'required'
  | 'minLength'
  | 'maxLength'
  | 'pattern'
  | 'minimum'
  | 'maximum'
  | 'format';

export interface ICommonValidator<T = object, TValidatorType extends string = TBaseValidators> {
  type: TValidatorType;
  value: T;
  message?: string;
  applyWhen?: IValidationRule;
  considerRequired?: boolean;
}

export type TValidators<
  TValidatorTypeExtends extends string = TBaseValidators,
  TValue = object,
> = Array<ICommonValidator<TValue, TValidatorTypeExtends>>;

export interface IValidationSchema<
  TValidatorTypeExtends extends string = TBaseValidators,
  TValue = object,
> {
  id: string;
  valueDestination?: string;
  validators: TValidators<TValidatorTypeExtends, TValue>;
  children?: IValidationSchema[];
}

export interface IValidationError {
  id: string;
  originId: string;
  invalidValue: unknown;
  message: string[];
}

export * from '../hooks/internal/useValidatorRef/types';

export type TValidator<
  T,
  TValidatorParams = unknown,
  TValidatorType extends string = TBaseValidators,
> = (value: T, validator: ICommonValidator<TValidatorParams, TValidatorType>) => void;

export type TDeepthLevelStack = number[] | undefined;
