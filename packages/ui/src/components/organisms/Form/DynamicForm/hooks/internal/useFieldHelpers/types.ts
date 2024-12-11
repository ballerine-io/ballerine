export interface IFieldHelpers {
  getTouched: (fieldId: string) => boolean;
  getValue: <T>(fieldId: string) => T;
  setTouched: (fieldId: string, touched: boolean) => void;
  setValue: <T>(fieldId: string, value: T) => void;
}
