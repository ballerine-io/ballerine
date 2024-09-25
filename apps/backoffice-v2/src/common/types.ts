import { ComponentProps } from 'react';
import { Action, Method, Resource, State } from './enums';
import translations from '../../public/locales/en/toast.json';
import { GenericFunction, ObjectValues } from '@ballerine/common';

export type WithRequired<TObject, TKey extends keyof TObject> = TObject & {
  [TProperty in TKey]-?: TObject[TProperty];
};

export type AnyArray = any[];

export type AnyRecord = Record<PropertyKey, any>;

export type GenericAsyncFunction = (...args: AnyArray) => Promise<any>;

export type NParameter<
  TFunction extends GenericFunction,
  TIndex extends number,
> = Parameters<TFunction>[TIndex];

export type DivComponent = ComponentProps<'div'>;

export type ButtonComponent = ComponentProps<'button'>;

export type TState = ObjectValues<typeof State>;

export type TMethod = ObjectValues<typeof Method>;

export type TResource = ObjectValues<typeof Resource>;

export type TAction = ObjectValues<typeof Action>;

export type TKeyofArrayElement<TArray extends AnyArray> = keyof TArray[number];

/**
 * Creates a new object type that omits the specified properties from the original object type.
 * Doing this ensures the result type is '{ example: string; }' instead of 'Omit<{ example: string; }, "example">'.
 */
export type TypesafeOmit<TObj extends Record<PropertyKey, unknown>, TProps extends keyof TObj> = {
  [TKey in Exclude<keyof TObj, TProps>]: TObj[TKey];
} & {};

export type UnknownRecord = Record<PropertyKey, unknown>;

export type NoInfer<T> = [T][T extends any ? 0 : never];

export type TToastKeyWithSuccessAndError = {
  [TKey in keyof typeof translations]: (typeof translations)[TKey] extends {
    success: string;
    error: string;
  }
    ? TKey
    : never;
}[keyof typeof translations];

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export type ExtendedJson =
  | string
  | number
  | boolean
  | null
  | undefined
  | ExtendedJson[]
  | { [key: string]: ExtendedJson };
