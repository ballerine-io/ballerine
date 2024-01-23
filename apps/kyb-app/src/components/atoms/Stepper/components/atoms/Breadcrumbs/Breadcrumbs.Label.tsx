import { BreadcrumbsLabelProps } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';
import { ctw } from '@ballerine/ui';

export const Label = ({ active, text, state }: BreadcrumbsLabelProps) => {
  return (
    <span
      className={ctw('text-sm leading-4', {
        'font-bold': active,
        'opacity-50': state === 'completed',
      })}
    >
      {text}
    </span>
  );
};
