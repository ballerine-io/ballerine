export interface IFieldHelpers {
  getTouched: (fieldId: string) => boolean;
  getValue: <T>(fieldId: string) => T;
  setTouched: (fieldId: string, touched: boolean) => void;
  setValue: <T>(fieldId: string, valueDestination: string, value: T) => void;
  touchAllFields: () => void;
  setValues: (values: any) => void;
}
