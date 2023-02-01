export type AnyRecord = Record<PropertyKey, any>;
export type RenameProperty<TObj, TOld extends keyof TObj, TNew extends PropertyKey> = Pick<
  TObj,
  Exclude<keyof TObj, TOld>
> & {
  [TKey in TNew]: TObj[TOld];
};
