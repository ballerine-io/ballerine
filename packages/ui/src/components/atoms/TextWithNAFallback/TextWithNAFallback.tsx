import { ElementType, forwardRef, ReactNode } from 'react';
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
    renderZero?: boolean;
  },
) => ReactNode;

export const TextWithNAFallback: TTextWithNAFallback = forwardRef(
  // @ts-ignore
  <TElement extends ElementType = 'span'>(
    {
      as,
      children,
      className,
      checkFalsy = true,
      renderZero = true,
      ...props
    }: PolymorphicComponentProps<TElement> & { checkFalsy?: boolean; renderZero?: boolean },
    ref?: PolymorphicRef<TElement>,
  ) => {
    const Component = as ?? 'span';
    const valueWithFallback =
      renderZero && children === 0
        ? 0
        : valueOrFallback('N/A', {
            checkFalsy,
          })(children);

    return (
      <Component
        {...props}
        className={ctw(
          {
            'text-slate-400': [
              checkFalsy && !renderZero && !children,
              checkFalsy && renderZero && !children && children !== 0,
              !checkFalsy && isNullish(children),
            ].some(Boolean),
          },
          className,
        )}
        ref={ref}
      >
        {valueWithFallback}
      </Component>
    );
  },
);

// @ts-ignore
TextWithNAFallback.displayName = 'TextWithNAFallback';
