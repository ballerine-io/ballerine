import { IFormEventElement, TElementEvent } from '../hooks/internal/useEvents/types';
import { IFieldHelpers } from '../hooks/internal/useFieldHelpers/types';
import { ITouchedState } from '../hooks/internal/useTouched';
import {
  IDynamicFormValidationParams,
  IPriorityField,
  IPriorityFieldParams,
  TElementsMap,
} from '../types';

export interface IDynamicFormCallbacks {
  onEvent?: (eventName: TElementEvent, element: IFormEventElement<any, any>) => void;
}

export interface IDynamicFormContext<TValues extends object> {
  values: TValues;
  touched: ITouchedState;
  disabled?: boolean;
  elementsMap: TElementsMap;
  fieldHelpers: IFieldHelpers;
  submit: (values: TValues) => void;
  callbacks: IDynamicFormCallbacks;
  metadata: Record<string, string>;
  validationParams: IDynamicFormValidationParams;
  priorityFields?: IPriorityField[];
  priorityFieldsParams?: IPriorityFieldParams;
}
