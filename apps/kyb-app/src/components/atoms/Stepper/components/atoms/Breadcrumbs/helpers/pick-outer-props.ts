import { ElementPropsPicker } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/helpers/types';
import { BreadcrumbsOuterProps } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';
import { ctw } from '@ballerine/ui';

export const pickOuterProps: ElementPropsPicker<BreadcrumbsOuterProps> = (
  state,
  active,
  theme,
): BreadcrumbsOuterProps => {
  const themeParams = theme[state].outer;

  const props: BreadcrumbsOuterProps = {
    className: ctw(themeParams.className, { [themeParams.activeClassName || '']: active }),
  };

  return props;
};
