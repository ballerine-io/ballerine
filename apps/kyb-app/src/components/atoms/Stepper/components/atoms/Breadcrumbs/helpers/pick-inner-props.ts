import { ElementPropsPicker } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/helpers/types';
import { BreadcrumbsInnerProps } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';
import { ctw } from '@ballerine/ui';

export const pickInnerProps: ElementPropsPicker<BreadcrumbsInnerProps> = (state, active, theme) => {
  const themeParams = theme[state].inner;

  const props: BreadcrumbsInnerProps = {
    className: ctw(themeParams.className, { [themeParams.activeClassName || '']: active }),
    icon: active ? themeParams.icon : themeParams.activeIcon || themeParams.icon,
  };

  return props;
};
