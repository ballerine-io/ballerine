import { FunctionComponent } from 'react';
import { IRule } from '../../hooks/useRuleEngine';
import { IValidationError, IValidationParams, TValidators } from '../../Validator';

export type TBaseFormElements = 'textinput' | 'fieldlist';

export interface IFormElement<TElements = TBaseFormElements, TParams = unknown> {
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

  ref?: React.RefObject<IFormRef<TValues>>;
}
