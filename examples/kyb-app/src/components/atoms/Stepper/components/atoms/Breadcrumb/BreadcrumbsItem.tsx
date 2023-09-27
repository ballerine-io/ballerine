import {
  BreadcrumbContext,
  BreadcrumbProps,
} from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/types';
import { breadcrumbContext } from './breadcrumb.context';
import { baseBreadcrumbTheme } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/base-theme';
import { useMemo } from 'react';
import { pickOuterProps } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/helpers/pick-outer-props';
import { pickInnerProps } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/helpers/pick-inner-props';
import { pickWrapperProps } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/helpers/pick-wrapper.props';
import { Outer } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/components/elements/Outer';
import { Wrapper } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/components/elements/Wrapper';
import { Inner } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/components/elements/Inner';

const { Provider } = breadcrumbContext;

export function BreadcrumbsItem({
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
      <BreadcrumbsItem.Outer>
        <BreadcrumbsItem.Wrapper>
          <BreadcrumbsItem.Inner />
        </BreadcrumbsItem.Wrapper>
      </BreadcrumbsItem.Outer>
    );
  }, [context, children]);

  return <Provider value={context}>{child}</Provider>;
}

BreadcrumbsItem.Inner = Inner;
BreadcrumbsItem.Outer = Outer;
BreadcrumbsItem.Wrapper = Wrapper;
