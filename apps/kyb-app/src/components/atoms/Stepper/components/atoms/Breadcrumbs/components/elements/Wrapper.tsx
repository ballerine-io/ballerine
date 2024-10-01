import { useBreadcrumbElementLogic } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/hooks/useBreadcrumbElement';
import { BreadcrumbsWrapperProps } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';
import { ctw } from '@ballerine/ui';

export const Wrapper = ({ className, children }: BreadcrumbsWrapperProps) => {
  const { props } = useBreadcrumbElementLogic<BreadcrumbsWrapperProps>('wrapper');

  return (
    <div
      id="Wrapper"
      className={ctw('overflow-hidden', className || props.className)}
      style={props.style}
    >
      {children}
    </div>
  );
};
