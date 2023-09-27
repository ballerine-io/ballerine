import {
  BreadcrumbState,
  BreadcrumbTheme,
} from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/types';

export type ElementPropsPicker<TElementProps> = (
  state: BreadcrumbState,
  active: boolean,
  theme: BreadcrumbTheme,
) => TElementProps;
