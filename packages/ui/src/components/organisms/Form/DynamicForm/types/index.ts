import { IValidationSchema } from '../../Validator';

export type TBaseFormElements = 'textinput';

export interface IFormElement<TElements = TBaseFormElements> {
  valueDestination: string;
  element: TElements;
  validate?: IValidationSchema[];
}

export interface IDynamicFormProps<TValues extends object> {
  values: TValues;
}
