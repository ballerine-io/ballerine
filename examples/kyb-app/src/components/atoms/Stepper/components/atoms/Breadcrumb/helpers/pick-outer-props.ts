import { ElementPropsPicker } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/helpers/types';
import { BreadcrumbsOuterProps } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/types';
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
