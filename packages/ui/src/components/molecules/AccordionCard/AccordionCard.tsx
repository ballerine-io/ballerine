import { FunctionComponent } from 'react';
import { Card } from '@/components';
import { AccordionCardTitle } from '@/components/molecules/AccordionCard/AccordionCard.Title';
import { AccordionCardContent } from '@/components/molecules/AccordionCard/AccordionCard.Content';
import { AccordionCardItem } from '@/components/molecules/AccordionCard/AccordionCard.Item';
import { IAccordionCardChildren } from '@/components/molecules/AccordionCard/interfaces';
import { AccordionCardProvider } from '@/components/molecules/AccordionCard/context/AccordionCardProvider/AccordionCardProvider';
import { AccordionCardProps } from '@/components/molecules/AccordionCard/types';
import { AccordionCardFooter } from '@/components/molecules/AccordionCard/AccordionCard.Footer';

export const AccordionCard: FunctionComponent<AccordionCardProps> & IAccordionCardChildren = ({
  children,
  value,
  onValueChange,
  ...props
}) => {
  return (
    <AccordionCardProvider value={value} onValueChange={onValueChange}>
      <Card {...props}>{children}</Card>
    </AccordionCardProvider>
  );
};
AccordionCard.displayName = 'AccordionCard';

AccordionCard.Title = AccordionCardTitle;
AccordionCard.Content = AccordionCardContent;
AccordionCard.Footer = AccordionCardFooter;
AccordionCard.Item = AccordionCardItem;
