import { pickLabelProps } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/helpers/pick-label-props';
import { BreadcrumbsLabelProps } from '@/components/atoms/Stepper/components/atoms/Breadcrumbs/types';
import { ctw } from '@ballerine/ui';
import { useMemo } from 'react';

export const Label = ({ active, text, state }: BreadcrumbsLabelProps) => {
  const labelProps = useMemo(() => pickLabelProps(state, active), [active, state]);

  return (
    <span
      className={ctw('text-sm leading-4', {
        'font-bold': active,
      })}
      {...labelProps}
    >
      {text}
    </span>
  );
};
