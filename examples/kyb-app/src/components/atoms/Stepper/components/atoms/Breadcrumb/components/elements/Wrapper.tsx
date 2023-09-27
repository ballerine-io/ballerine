import { useBreadcrumbElement } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/hooks/useBreadcrumbElement';
import { BreadcrumbsWrapperProps } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/types';
import clsx from 'clsx';

export const Wrapper = ({ className, children }: BreadcrumbsWrapperProps) => {
  const { props } = useBreadcrumbElement<BreadcrumbsWrapperProps>('wrapper');

  return <div className={clsx('overflow-hidden', className || props.className)}>{children}</div>;
};
