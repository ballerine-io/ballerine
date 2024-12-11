import { ITouchedState } from '../hooks/internal/useTouched';
import { TElementsMap } from '../types';

export interface IDynamicFormContext<TValues extends object> {
  values: TValues;
  touched: ITouchedState;
  elementsMap: TElementsMap;
  submit: () => void;
}
