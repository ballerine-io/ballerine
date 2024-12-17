import { FunctionComponent } from 'react';
import { IRule } from '../../hooks/useRuleEngine';
import { IValidationError, IValidationParams, TValidators } from '../../Validator';
import { IFormEventElement, TElementEvent } from '../hooks/internal/useEvents/types';

export type TBaseFormElements = 'textinput' | 'fieldlist';

export interface ICommonFieldParams {
  label?: string;
  placeholder?: string;
}

export interface IFormElement<TElements = TBaseFormElements, TParams = ICommonFieldParams> {
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
  TElements extends string = TBaseFormElements,
  TParams = unknown,
> = FunctionComponent<{
  element: IFormElement<TElements, TParams>;
}>;

export type TDynamicFormField<
  TElements extends string = TBaseFormElements,
  TParams = ICommonFieldParams,
> = FunctionComponent<{
  element: IFormElement<TElements, TParams>;
  children?: React.ReactNode | React.ReactNode[];
}>;

export type TElementsMap<TElements extends string = TBaseFormElements> = Record<
  TElements,
  TDynamicFormElement
>;

export interface IDynamicFormProps<TValues = object, TElements extends string = TBaseFormElements> {
  values: TValues;
  elements: Array<IFormElement<TElements>>;
  elementsMap: TElementsMap<TElements>;

  validationParams?: IValidationParams;
  onChange?: (newValues: TValues) => void;
  onFieldChange?: (fieldName: string, newValue: unknown, newValues: TValues) => void;
  onSubmit?: (values: TValues) => void;
  onEvent?: (eventName: TElementEvent, element: IFormEventElement<TElements>) => void;

  ref?: React.RefObject<IFormRef<TValues>>;
}
