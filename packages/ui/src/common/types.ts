import {
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
  ElementType,
  FunctionComponent,
  JSXElementConstructor,
  PropsWithChildren,
  ReactNode,
} from 'react';

export type ChildrenList = ReactNode[];
export type AnyChildren = ReactNode | ChildrenList;
export type AnyObject = Record<PropertyKey, any>;
export type WithTestId<TParams> = { testId?: string } & TParams;

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

export type FunctionComponentWithChildren<P = {}> = FunctionComponent<PropsWithChildren<P>>;
