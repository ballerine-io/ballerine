import { useBreadcrumbElementLogic } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/hooks/useBreadcrumbElement';
import { BreadcrumbsOuterProps } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';

export const Outer = ({ className, children }: BreadcrumbsOuterProps) => {
  const { props } = useBreadcrumbElementLogic<BreadcrumbsOuterProps>('outer');

  return <div className={className || props.className}>{children}</div>;
};
