import { useBreadcrumbElementLogic } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/hooks/useBreadcrumbElement';
import { BreadcrumbsInnerProps } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';
import { ctw } from '@ballerine/ui';

export const Inner = ({ className, icon }: BreadcrumbsInnerProps) => {
  const { props } = useBreadcrumbElementLogic<BreadcrumbsInnerProps>('inner');

  return (
    <div className={ctw('w-full', 'h-full', className || props.className)}>
      {icon || props.icon ? (
        <div className="flex h-full w-full items-center justify-center">{icon || props.icon}</div>
      ) : null}
    </div>
  );
};
