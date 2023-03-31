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
import { RegisteredRoutesInfo } from '@tanstack/react-router';

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

export type FunctionComponentWithChildren<P = AnyRecord> = FunctionComponent<PropsWithChildren<P>>;

export type TObjectValues<TObject extends AnyRecord> = TObject[keyof TObject];

export type TState = TObjectValues<typeof State>;

export type TMethod = TObjectValues<typeof Method>;

export type TResource = TObjectValues<typeof Resource>;

export type TAction = TObjectValues<typeof Action>;

// @ts-ignore
export type TRouteId = keyof RegisteredRoutesInfo['routeInfoById'];

export type TKeyofArrayElement<TArray extends AnyArray> = keyof TArray[number];

export type PropsOf<TElement extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>> =
  JSX.LibraryManagedAttributes<TElement, ComponentPropsWithoutRef<TElement>>;
export type AsProps<TElement extends ElementType> = {
  as?: TElement;
};
export type ExtendableProps<ExtendedProps = {}, OverrideProps = {}> = OverrideProps &
  Omit<ExtendedProps, keyof OverrideProps>;
export type InheritableElementProps<TElement extends ElementType, Props = {}> = ExtendableProps<
  PropsOf<TElement>,
  Props
>;
export type PolymorphicComponentProps<
  TElement extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
  Props = {},
> = InheritableElementProps<TElement, Props & AsProps<TElement>>;
export type PolymorphicRef<TElement extends ElementType> = ComponentPropsWithRef<TElement>['ref'];
export type PolymorphicComponentPropsWithRef<
  TElement extends keyof JSX.IntrinsicElements | JSXElementConstructor<any>,
  Props = {},
> = PolymorphicComponentProps<TElement, Props> & { ref?: PolymorphicRef<TElement> };
