import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  FunctionComponent,
  JSXElementConstructor,
  PropsWithChildren,
} from 'react';
import { Action, Method, Resource, State } from './enums';
import translations from '../../public/locales/en/toast.json';

export type WithRequired<TObject, TKey extends keyof TObject> = TObject & {
  [TProperty in TKey]-?: TObject[TProperty];
};

export type AnyArray = any[];

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

export type NoInfer<T> = [T][T extends any ? 0 : never];

export type TToastKeyWithSuccessAndError = {
  [TKey in keyof typeof translations]: (typeof translations)[TKey] extends {
    success: string;
    error: string;
  }
    ? TKey
    : never;
}[keyof typeof translations];

// Polymorphic component props

// A more precise version of just ComponentPropsWithoutRef on its own
export type PolymorphicPropsOf<
  TElement extends keyof React.JSX.IntrinsicElements | JSXElementConstructor<any>,
> = React.JSX.LibraryManagedAttributes<TElement, ComponentPropsWithoutRef<TElement>>;

type PolymorphicAsProp<TElement extends ElementType> = {
  /**
   * An override of the default HTML tag.
   * Can also be another React component.
   */
  as?: TElement;
};

/**
 * Allows for extending a set of props (`ExtendedProps`) by an overriding set of props
 * (`OverrideProps`), ensuring that any duplicates are overridden by the overriding
 * set of props.
 */
export type ExtendableProps<ExtendedProps = {}, OverrideProps = {}> = OverrideProps &
  Omit<ExtendedProps, keyof OverrideProps>;

/**
 * Allows for inheriting the props from the specified element type so that
 * props like children, className & style work, as well as element-specific
 * attributes like aria roles. The component (`C`) must be passed in.
 */
export type InheritableElementProps<TElement extends ElementType, TProps = {}> = ExtendableProps<
  PolymorphicPropsOf<TElement>,
  TProps
>;

/**
 * A more sophisticated version of `InheritableElementProps` where
 * the passed in `as` prop will determine which props can be included
 */
export type PolymorphicComponentProps<
  TElement extends ElementType,
  TProps = {},
> = InheritableElementProps<TElement, TProps & PolymorphicAsProp<TElement>>;

/**
 * Utility type to extract the `ref` prop from a polymorphic component
 */
export type PolymorphicRef<TElement extends ElementType> = ComponentPropsWithRef<TElement>['ref'];

/**
 * A wrapper of `PolymorphicComponentProps` that also includes the `ref`
 * prop for the polymorphic component
 */
export type PolymorphicComponentPropsWithRef<
  TElement extends ElementType,
  TProps = {},
> = PolymorphicComponentProps<TElement, TProps> & { ref?: PolymorphicRef<TElement> };

// /PolymorphicComponentProps

export const Severity = {
  CRITICAL: 'critical',
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

export const Severities = [
  Severity.CRITICAL,
  Severity.HIGH,
  Severity.MEDIUM,
  Severity.LOW,
] as const satisfies ReadonlyArray<TObjectValues<typeof Severity>>;

export type TSeverity = (typeof Severities)[number];

export type TSeverities = typeof Severities;

export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };
