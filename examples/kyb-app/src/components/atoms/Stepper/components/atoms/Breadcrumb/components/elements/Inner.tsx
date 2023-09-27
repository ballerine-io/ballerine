import { useBreadcrumbElement } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/hooks/useBreadcrumbElement';
import { BreadcrumbsInnerProps } from '@app/components/atoms/Stepper/components/atoms/Breadcrumb/types';
import clsx from 'clsx';

export const Inner = ({ className, icon }: BreadcrumbsInnerProps) => {
  const { props } = useBreadcrumbElement<BreadcrumbsInnerProps>('inner');

  return (
    <div className={clsx('w-full', 'h-full', className || props.className)}>
      {icon || props.icon ? (
        <div className="flex h-full w-full items-center justify-center">{icon || props.icon}</div>
      ) : null}
    </div>
  );
};
