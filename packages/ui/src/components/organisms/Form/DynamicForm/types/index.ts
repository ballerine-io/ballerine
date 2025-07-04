import { AnyObject } from '@/common';
import { FunctionComponent } from 'react';
import { ICommonValidator, IValidationError, IValidationParams } from '../../Validator';
import { IEventsProviderProps } from '../providers/EventsProvider';
import { IHttpParams } from '@/common/hooks/useHttp';
import { TUIElement, TUIElements } from '@ballerine/common';

export interface ICommonFieldParams {
  label?: string;
  placeholder?: string;
  description?: string;
  syncEvents?: boolean;
}

export interface IFormRef<TValues = object> {
  submit: () => void;
  validate(): IValidationError[] | null;
  setValues: (values: TValues) => void;
  setTouched: (touched: Record<string, boolean>) => void;
  setFieldValue: (fieldName: string, value: unknown) => void;
  setFieldTouched: (fieldName: string, isTouched: boolean) => void;
}

export type TDynamicFormElement<TElement extends TUIElement> = FunctionComponent<{
  element: TElement;
  children?: React.ReactNode | React.ReactNode[];
}>;

export type TDynamicFormField<TElement extends TUIElement> = FunctionComponent<{
  element: TElement;
  children?: React.ReactNode | React.ReactNode[];
}>;

export type TElementsMap = Record<TUIElements, TUIElement>;

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

export type TCommonHttpParams = Partial<Pick<IHttpParams, 'params' | 'headers'>>;

export interface IDynamicFormProps<TValues extends object> {
  values: TValues;
  elements: Array<TUIElement>;

  fieldExtends?: Record<string, TDynamicFormField<TUIElement>>;
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
  httpParams?: TCommonHttpParams;
  metadata?: AnyObject;
}

export type {
  TFormEventElement as IFormEventElement,
  TElementEvent,
} from '../hooks/internal/useEvents';
export type { TBaseFields } from '../repositories';
