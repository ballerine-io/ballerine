import { ElementPropsPicker } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/helpers/types';
import { BreadcrumbsInnerProps } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/types';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const pickInnerProps: ElementPropsPicker<BreadcrumbsInnerProps> = (state, active, theme) => {
  const themeParams = theme[state].inner;

  const props: BreadcrumbsInnerProps = {
    className: twMerge(
      clsx(themeParams.className, { [themeParams.activeClassName || '']: active }),
    ),
    icon: active ? themeParams.icon : themeParams.activeIcon || themeParams.icon,
  };

  return props;
};
