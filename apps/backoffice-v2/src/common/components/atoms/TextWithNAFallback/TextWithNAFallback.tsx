import React, { ComponentPropsWithoutRef, ElementType, PropsWithChildren } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';

type PolymorphicAsProp<TElement extends ElementType> = {
  as?: TElement;
};

type PolymorphicProps<TElement extends ElementType> = PropsWithChildren<
  ComponentPropsWithoutRef<TElement> & PolymorphicAsProp<TElement>
>;

export const TextWithNAFallback = <TElement extends ElementType = 'span'>({
  as,
  children,
  className,
  ...props
}: PolymorphicProps<TElement>) => {
  const Component = as ?? 'span';

  return (
    <Component
      {...props}
      className={ctw(
        {
          'text-slate-400': !children,
        },
        className,
      )}
    >
      {valueOrNA(children)}
    </Component>
  );
};
