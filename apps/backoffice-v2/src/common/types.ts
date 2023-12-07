import { ComponentProps, FunctionComponent, PropsWithChildren } from 'react';
import { Action, Method, Resource, State } from './enums';

export type WithRequired<TObject, TKey extends keyof TObject> = TObject & {
  [TProperty in TKey]-?: TObject[TProperty];
};

export type AnyArray = Array<any>;

export type AnyRecord = Record<PropertyKey, any>;

export type GenericFunction = (...args: AnyArray) => any;

export type GenericAsyncFunction = (...args: AnyArray) => Promise<any>;

export type NParameter<
  TFunction extends GenericFunction,
  TIndex extends number,
> = Parameters<TFunction>[TIndex];

export type DivComponent = ComponentProps<'div'>;

export type ButtonComponent = ComponentProps<'button'>;

export type FunctionComponentWithChildren<P = {}> = FunctionComponent<PropsWithChildren<P>>;

export type TObjectValues<TObject extends AnyRecord> = TObject[keyof TObject];

export type TState = TObjectValues<typeof State>;

export type TMethod = TObjectValues<typeof Method>;

export type TResource = TObjectValues<typeof Resource>;

export type TAction = TObjectValues<typeof Action>;

export type TKeyofArrayElement<TArray extends AnyArray> = keyof TArray[number];

/**
 * Creates a new object type that omits the specified properties from the original object type.
 * Doing this ensures the result type is '{ example: string; }' instead of 'Omit<{ example: string; }, "example">'.
 */
export type TypesafeOmit<TObj extends Record<PropertyKey, unknown>, TProps extends keyof TObj> = {
  [TKey in Exclude<keyof TObj, TProps>]: TObj[TKey];
} & {};

export type UnknownRecord = Record<PropertyKey, unknown>;
