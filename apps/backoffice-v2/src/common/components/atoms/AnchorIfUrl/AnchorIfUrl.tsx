import React, { ComponentProps, ElementType, forwardRef, ReactNode } from 'react';
import {
  PolymorphicComponentProps,
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
} from '@/common/types';
import { checkIsUrl } from '@/common/utils/check-is-url/check-is-url';
import { BallerineLink } from '@/common/components/atoms/BallerineLink/BallerineLink';

export type TAnchorIfUrl = <TElement extends ElementType = 'span'>(
  props: PolymorphicComponentPropsWithRef<TElement> & ComponentProps<'a'>,
) => ReactNode;

export const AnchorIfUrl: TAnchorIfUrl = forwardRef(
  <TElement extends ElementType = 'span'>(
    { as, children, ...props }: PolymorphicComponentProps<TElement> & ComponentProps<'a'>,
    ref?: PolymorphicRef<TElement>,
  ) => {
    const Component = as ?? 'span';

    if (checkIsUrl(children)) {
      return (
        <BallerineLink ref={ref} {...props}>
          {children}
        </BallerineLink>
      );
    }

    return (
      <Component ref={ref} {...props}>
        {children}
      </Component>
    );
  },
);

// @ts-ignore
AnchorIfUrl.displayName = 'AnchorIfUrl';
