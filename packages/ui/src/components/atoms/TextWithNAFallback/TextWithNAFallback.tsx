import React, { ElementType, forwardRef, ReactNode } from 'react';
import { isNullish, valueOrFallback } from '@ballerine/common';
import {
  ctw,
  PolymorphicComponentProps,
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '@/common';

export type TTextWithNAFallback = <TElement extends ElementType = 'span'>(
  props: PolymorphicComponentPropsWithRef<TElement> & {
    checkFalsy?: boolean;
  },
) => ReactNode;

export const TextWithNAFallback: TTextWithNAFallback = forwardRef(
  <TElement extends ElementType = 'span'>(
    {
      as,
      children,
      className,
      checkFalsy = true,
      ...props
    }: PolymorphicComponentProps<TElement> & { checkFalsy?: boolean },
    ref?: PolymorphicRef<TElement>,
  ) => {
    const Component = as ?? 'span';

    return (
      <Component
        {...props}
        className={ctw(
          {
            'text-slate-400': checkFalsy ? !children : isNullish(children),
          },
          className,
        )}
        ref={ref}
      >
        {valueOrFallback('N/A', {
          checkFalsy,
        })(children)}
      </Component>
    );
  },
);

// @ts-ignore
TextWithNAFallback.displayName = 'TextWithNAFallback';
