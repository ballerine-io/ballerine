import { useBreadcrumbElement } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/hooks/useBreadcrumbElement';
import { BreadcrumbsOuterProps } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/types';

export const Outer = ({ className, children }: BreadcrumbsOuterProps) => {
  const { props } = useBreadcrumbElement<BreadcrumbsOuterProps>('outer');

  return <div className={className || props.className}>{children}</div>;
};
