import { useBreadcrumbContext } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/hooks/useBreadcrumb';
import { BreadcrumbElements } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';

export const useBreadcrumbElementLogic = <TProps>(
  elementType: BreadcrumbElements,
): { isActive: boolean; props: TProps } => {
  const { isActive, elementsProps } = useBreadcrumbContext();

  return {
    isActive,
    props: elementsProps[`${elementType}Props`] as TProps,
  };
};
