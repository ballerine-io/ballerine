import {
  BreadcrumbContext,
  BreadcrumbProps,
} from '@app/components/atoms/Stepper/components/atoms/Breadcrumbs/types';
import { breadcrumbContext } from './breadcrumb.context';
import { useMemo } from 'react';
import { pickOuterProps } from '@app/components/atoms/Stepper/components/atoms/Breadcrumbs/helpers/pick-outer-props';
import { pickInnerProps } from '@app/components/atoms/Stepper/components/atoms/Breadcrumbs/helpers/pick-inner-props';
import { pickWrapperProps } from '@app/components/atoms/Stepper/components/atoms/Breadcrumbs/helpers/pick-wrapper.props';
import { Outer } from '@app/components/atoms/Stepper/components/atoms/Breadcrumbs/components/elements/Outer';
import { Wrapper } from '@app/components/atoms/Stepper/components/atoms/Breadcrumbs/components/elements/Wrapper';
import { Inner } from '@app/components/atoms/Stepper/components/atoms/Breadcrumbs/components/elements/Inner';
import { baseBreadcrumbTheme } from '@app/components/atoms/Stepper/components/atoms/Breadcrumbs/theme/base-theme';

const { Provider } = breadcrumbContext;

export function Item({
  active = false,
  theme = baseBreadcrumbTheme,
  state = 'idle',
  children,
}: BreadcrumbProps) {
  const context: BreadcrumbContext = useMemo(() => {
    const ctx: BreadcrumbContext = {
      isActive: active,
      elementsProps: {
        outerProps: pickOuterProps(state, active, theme),
        innerProps: pickInnerProps(state, active, theme),
        wrapperProps: pickWrapperProps(state, active, theme),
      },
    };

    return ctx;
  }, [theme, active, state]);

  const child = useMemo(() => {
    if (typeof children === 'function') return children(context);
    if (children) return children;

    return (
      <Item.Outer>
        <Item.Wrapper>
          <Item.Inner />
        </Item.Wrapper>
      </Item.Outer>
    );
  }, [context, children]);

  return <Provider value={context}>{child}</Provider>;
}

Item.Inner = Inner;
Item.Outer = Outer;
Item.Wrapper = Wrapper;
