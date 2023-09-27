import { AnyChildren } from '@ballerine/ui';

export type BreadcrumbState = 'idle' | 'warning' | 'completed';
export type BreadcrumbElements = 'wrapper' | 'outer' | 'inner';

export interface BreadcrumbsOuterProps {
  className?: string;
  children?: AnyChildren;
}

export interface BreadcrumbsInnerProps {
  className?: string;
  icon?: React.ReactNode;
}

export interface BreadcrumbsWrapperProps {
  className?: string;
  children?: AnyChildren;
}

export interface BreadcrumbContext {
  isActive: boolean;
  elementsProps: {
    outerProps: BreadcrumbsOuterProps;
    innerProps: BreadcrumbsInnerProps;
    wrapperProps: BreadcrumbsWrapperProps;
  };
}

export interface InnerThemeSettings {
  className: string;
  activeClassName?: string;
  icon?: React.ReactNode;
  activeIcon?: React.ReactNode;
}

export interface OuterThemeSettings {
  className: string;
  activeClassName?: string;
}

export interface WrapperThemeSettings {
  className: string;
  activeClassName?: string;
}

export interface BreadcrumbElementSettings {
  inner: InnerThemeSettings;
  outer: OuterThemeSettings;
  wrapper: WrapperThemeSettings;
}

export type BreadcrumbTheme = Record<BreadcrumbState, BreadcrumbElementSettings>;

export type BreadcrumbChildrenCallback = (context: BreadcrumbContext) => React.ReactNode;

export interface BreadcrumbProps {
  state?: BreadcrumbState;
  active?: boolean;
  theme?: BreadcrumbTheme;
  children?: React.ReactNode | BreadcrumbChildrenCallback;
}
