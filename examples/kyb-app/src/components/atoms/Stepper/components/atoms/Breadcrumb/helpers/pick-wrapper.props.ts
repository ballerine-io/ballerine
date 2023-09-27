import { ElementPropsPicker } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/helpers/types';
import { BreadcrumbsWrapperProps } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/types';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const pickWrapperProps: ElementPropsPicker<BreadcrumbsWrapperProps> = (
  state,
  active,
  theme,
) => {
  const themeParams = theme[state].wrapper;

  const props: BreadcrumbsWrapperProps = {
    className: twMerge(
      clsx(themeParams.className, { [themeParams.activeClassName || '']: active }),
    ),
  };

  return props;
};
