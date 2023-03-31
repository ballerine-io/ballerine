import { ElementType, FunctionComponent, JSXElementConstructor, ReactElement } from 'react';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/atoms/Button/Button';
import { PolymorphicComponentPropsWithRef } from '@/types';

export type ButtonProps<TElement extends ElementType> = PolymorphicComponentPropsWithRef<
  TElement,
  VariantProps<typeof buttonVariants>
>;
export type ButtonComponent = {
  <TElement extends keyof JSX.IntrinsicElements | JSXElementConstructor<any> = 'button'>(
    props: ButtonProps<TElement>,
  ): ReactElement | null;
} & FunctionComponent;
