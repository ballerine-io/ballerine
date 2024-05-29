import React, { ElementType, forwardRef, ReactNode } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';
import {
  PolymorphicComponentProps,
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '@/common/types';
import { valueOrFallback } from '@/common/utils/value-or-fallback/value-or-fallback';

export type TTextWithNAFallback = <TElement extends ElementType = 'span'>(
  props: PolymorphicComponentPropsWithRef<TElement> & {
    checkFalsy?: boolean;
  },
) => ReactNode;

export const TextWithNAFallback: TTextWithNAFallback = forwardRef(
  <TElement extends ElementType = 'span'>(
    { as, children, className, checkFalsy = true, ...props }: PolymorphicComponentProps<TElement>,
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
        {valueOrFallback('N/A', {
          checkFalsy,
        })(children)}
      </Component>
    );
  },
);

// @ts-ignore
TextWithNAFallback.displayName = 'TextWithNAFallback';
