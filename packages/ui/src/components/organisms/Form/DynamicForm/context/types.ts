import { IFieldHelpers } from '../hooks/internal/useFieldHelpers/types';
import { ITouchedState } from '../hooks/internal/useTouched';
import { TElementsMap } from '../types';

export interface IDynamicFormContext<TValues extends object> {
  values: TValues;
  touched: ITouchedState;
  elementsMap: TElementsMap;
  fieldHelpers: IFieldHelpers;
  submit: () => void;
}
