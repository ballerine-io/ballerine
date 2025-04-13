import { AnyObject } from '@/common';
import { FunctionComponent } from 'react';
import { IRule } from '../../hooks/useRuleEngine';
import {
  ICommonValidator,
  IValidationError,
  IValidationParams,
  TValidators,
} from '../../Validator';
import { IEventsProviderProps } from '../providers/EventsProvider';

export interface ICommonFieldParams {
  label?: string;
  placeholder?: string;
  description?: string;
  syncEvents?: boolean;
}

export interface IFormElement<TElements = string, TParams = object> {
  id: string;
  valueDestination: string;
  element: TElements;
  defaultValue?: unknown;
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
  TParams = object,
> = FunctionComponent<{
  element: IFormElement<TElements, TParams>;
  children?: React.ReactNode | React.ReactNode[];
}>;

export type TDynamicFormField<TParams = object> = FunctionComponent<{
  element: IFormElement<string, TParams>;
  children?: React.ReactNode | React.ReactNode[];
}>;

export type TElementsMap = Record<string, TDynamicFormElement<any, any>>;

export interface IDynamicFormValidationParams extends IValidationParams {
  validateOnBlur?: boolean;
  globalValidationRules?: Array<ICommonValidator<object, string>>;
}

export interface IPriorityField {
  id: string;
  reason: string;
}

export interface IPriorityFieldParams {
  behavior: 'disableOthers' | 'hideOthers' | 'doNothing';
}

export interface IDynamicFormProps<TValues extends object> {
  values: TValues;
  elements: Array<IFormElement<string, any>>;

  fieldExtends?: Record<string, TDynamicFormField<any> | TDynamicFormElement<any, any>>;
  validationParams?: IDynamicFormValidationParams;
  priorityFields?: IPriorityField[];
  priorityFieldsParams?: IPriorityFieldParams;

  // Disables all field elements
  disabled?: boolean;

  onChange?: (newValues: TValues) => void;
  onFieldChange?: (fieldName: string, newValue: unknown, newValues: TValues) => void;
  onSubmit?: (values: TValues) => void;
  onEvent?: IEventsProviderProps['onEvent'];

  ref?: React.RefObject<IFormRef<TValues>>;
  metadata?: AnyObject;
}

export type { IFormEventElement, TElementEvent } from '../hooks/internal/useEvents';
export type { TBaseFields } from '../repositories';
