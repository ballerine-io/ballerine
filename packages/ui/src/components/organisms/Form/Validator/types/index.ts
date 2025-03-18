import { AnyObject } from '@/common';
import { IUseValidateParams } from '../hooks/internal/useValidate';

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
  | 'format'
  | 'document'
  | 'minimumAge'
  | 'futureDate'
  | 'pastDate';
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
  metadata?: AnyObject;
  getThisContext?: (context: AnyObject, metadata: AnyObject, stack: TDeepthLevelStack) => AnyObject;
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

export type TValidationParams = IUseValidateParams;
