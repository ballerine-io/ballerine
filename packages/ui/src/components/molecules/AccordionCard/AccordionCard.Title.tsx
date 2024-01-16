import { FunctionComponent } from 'react';
import { CardHeader, CardTitle } from '@/components';
import { ctw } from '@/utils';
import { AccordionTitle } from '@/components/molecules/AccordionCard/types';

export const AccordionCardTitle: FunctionComponent<AccordionTitle> = ({
  children,
  cardTitleProps,
  ...props
}) => {
  return (
    <CardHeader {...props} className={ctw(`pb-2`, props?.className)}>
      <CardTitle {...cardTitleProps} className={ctw(`text-xl`, cardTitleProps?.className)}>
        {children}
      </CardTitle>
    </CardHeader>
  );
};
AccordionCardTitle.displayName = 'Accordion.Title';
