import { BreadcrumbContext, BreadcrumbProps } from './types';
import { breadcrumbContext } from './breadcrumb.context';
import { useMemo } from 'react';
import { pickOuterProps } from './helpers/pick-outer-props';
import { pickInnerProps } from './helpers/pick-inner-props';
import { pickWrapperProps } from './helpers/pick-wrapper.props';
import { Outer } from './components/elements/Outer';
import { Wrapper } from './components/elements/Wrapper';
import { Inner } from './components/elements/Inner';
import { baseBreadcrumbTheme } from './theme/base-theme';

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
