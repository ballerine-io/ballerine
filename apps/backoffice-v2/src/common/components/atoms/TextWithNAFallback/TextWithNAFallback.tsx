import React, { ElementType, forwardRef, ReactNode } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';
import { valueOrNA } from '@/common/utils/value-or-na/value-or-na';
import {
  PolymorphicComponentProps,
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '@/common/types';

export type TTextWithNAFallback = <TElement extends ElementType = 'span'>(
  props: PolymorphicComponentPropsWithRef<TElement>,
) => ReactNode;

export const TextWithNAFallback: TTextWithNAFallback = forwardRef(
  <TElement extends ElementType = 'span'>(
    { as, children, className, ...props }: PolymorphicComponentProps<TElement>,
    ref?: PolymorphicRef<TElement>,
  ) => {
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
        ref={ref}
      >
        {valueOrNA(children)}
      </Component>
    );
  },
);

// @ts-ignore
TextWithNAFallback.displayName = 'TextWithNAFallback';
