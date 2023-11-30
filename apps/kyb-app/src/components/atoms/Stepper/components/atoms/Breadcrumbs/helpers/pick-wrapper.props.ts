import { ElementPropsPicker } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/helpers/types';
import { BreadcrumbsWrapperProps } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';
import { ctw } from '@ballerine/ui';

export const pickWrapperProps: ElementPropsPicker<BreadcrumbsWrapperProps> = (
  state,
  active,
  theme,
) => {
  const themeParams = theme[state].wrapper;

  const props: BreadcrumbsWrapperProps = {
    className: ctw(themeParams.className, { [themeParams.activeClassName || '']: active }),
  };

  return props;
};
