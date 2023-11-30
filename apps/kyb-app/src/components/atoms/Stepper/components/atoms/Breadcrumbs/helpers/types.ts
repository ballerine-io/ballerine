import {
  BreadcrumbState,
  BreadcrumbTheme,
} from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';

export type ElementPropsPicker<TElementProps> = (
  state: BreadcrumbState,
  active: boolean,
  theme: BreadcrumbTheme,
) => TElementProps;
