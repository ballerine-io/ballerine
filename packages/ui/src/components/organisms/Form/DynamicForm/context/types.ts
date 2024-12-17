import { IFormEventElement, TElementEvent } from '../hooks/internal/useEvents/types';
import { IFieldHelpers } from '../hooks/internal/useFieldHelpers/types';
import { ITouchedState } from '../hooks/internal/useTouched';
import { TElementsMap } from '../types';

export interface IDynamicFormCallbacks {
  onEvent?: (eventName: TElementEvent, element: IFormEventElement<any, any>) => void;
}

export interface IDynamicFormContext<TValues extends object> {
  values: TValues;
  touched: ITouchedState;
  elementsMap: TElementsMap;
  fieldHelpers: IFieldHelpers;
  submit: () => void;
  callbacks: IDynamicFormCallbacks;
}
