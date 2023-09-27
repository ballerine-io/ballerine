import { useBreadcrumb } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/hooks/useBreadcrumb';
import { BreadcrumbElements } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/types';

export const useBreadcrumbElement = <TProps>(
  elementType: BreadcrumbElements,
): { isActive: boolean; props: TProps } => {
  const { isActive, elementsProps } = useBreadcrumb();

  return {
    isActive,
    props: elementsProps[`${elementType}Props`] as TProps,
  };
};
