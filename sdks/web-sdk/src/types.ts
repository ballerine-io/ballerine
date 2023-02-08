export type AnyRecord = Record<PropertyKey, any>;
export type RenameProperty<TObj, TOld extends keyof TObj, TNew extends PropertyKey> = Pick<
  TObj,
  Exclude<keyof TObj, TOld>
> & {
  [TKey in TNew]: TObj[TOld];
};
export type ComputeDeep<TIntersection> = {
  [TKey in keyof TIntersection]: TIntersection[TKey] extends Record<PropertyKey, any>
    ? ComputeDeep<TIntersection[TKey]>
    : TIntersection[TKey];
} & {};
