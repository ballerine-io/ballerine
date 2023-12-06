import { BaseLabel } from '@/components/atoms/Stepper/components/atoms/BaseLabel/BaseLabel';
import { BreadcrumbsLabelProps } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';
import { ctw } from '@ballerine/ui';

export const Label = ({ active, text, state }: BreadcrumbsLabelProps) => {
  return (
    <BaseLabel
      className={ctw({ 'font-bold': active, 'opacity-50': state === 'completed' })}
      text={text}
    />
  );
};
