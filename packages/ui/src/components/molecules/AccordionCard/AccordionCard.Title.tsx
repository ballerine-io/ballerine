import { FunctionComponent } from 'react';
import { CardHeader, CardTitle } from '@/components';
import { ctw } from '@/utils';
import { AccordionTitle } from '@/components/molecules/AccordionCard/types';

export const AccordionCardTitle: FunctionComponent<AccordionTitle> = ({
  children,
  cardTitleProps,
  leftChildren,
  rightChildren,
  ...props
}) => {
  return (
    <CardHeader {...props} className={ctw(`pb-2`, props?.className)}>
      {leftChildren}
      <CardTitle {...cardTitleProps} className={ctw(`text-xl`, cardTitleProps?.className)}>
        {children}
      </CardTitle>
      {rightChildren}
    </CardHeader>
  );
};
AccordionCardTitle.displayName = 'Accordion.Title';
