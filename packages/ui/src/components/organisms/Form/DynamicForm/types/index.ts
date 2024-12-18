import { FunctionComponent } from 'react';
import { IRule } from '../../hooks/useRuleEngine';
import { IValidationError, IValidationParams, TValidators } from '../../Validator';
import { IFormEventElement, TElementEvent } from '../hooks/internal/useEvents/types';

export interface ICommonFieldParams {
  label?: string;
  placeholder?: string;
}

export interface IFormElement<TElements = string, TParams = ICommonFieldParams> {
  id: string;
  valueDestination: string;
  element: TElements;
  validate?: TValidators;
  disable?: IRule[];
  hidden?: IRule[];
  children?: IFormElement[];
  params?: TParams;
}

export interface IFormRef<TValues = object> {
  submit: () => void;
  validate(): IValidationError[] | null;
  setValues: (values: TValues) => void;
  setTouched: (touched: Record<string, boolean>) => void;
  setFieldValue: (fieldName: string, value: unknown) => void;
  setFieldTouched: (fieldName: string, isTouched: boolean) => void;
}

export type TDynamicFormElement<
  TElements extends string = string,
  TParams = unknown,
> = FunctionComponent<{
  element: IFormElement<TElements, TParams>;
}>;

export type TDynamicFormField<TParams = ICommonFieldParams> = FunctionComponent<{
  element: IFormElement<string, TParams>;
  children?: React.ReactNode | React.ReactNode[];
}>;

export type TElementsMap = Record<string, TDynamicFormElement<any, any>>;

export interface IDynamicFormProps<TValues = object> {
  values: TValues;
  elements: Array<IFormElement<string, any>>;

  fieldExtends?: Record<string, TDynamicFormField<string>>;

  validationParams?: IValidationParams;
  onChange?: (newValues: TValues) => void;
  onFieldChange?: (fieldName: string, newValue: unknown, newValues: TValues) => void;
  onSubmit?: (values: TValues) => void;
  onEvent?: (eventName: TElementEvent, element: IFormEventElement<string, any>) => void;

  ref?: React.RefObject<IFormRef<TValues>>;
}
