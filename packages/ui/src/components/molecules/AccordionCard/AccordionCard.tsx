import { ComponentProps, FunctionComponent } from 'react';
import { Card, CardContent } from '@/components';
import { AccordionTitle } from '@/components/molecules/AccordionCard/AccordionCard.Title';

export const AccordionCard: FunctionComponent<ComponentProps<typeof Card>> = ({
  children,
  ...props
}) => {
  return <Card {...props}>{children}</Card>;
};
AccordionCard.displayName = 'AccordionCard';

AccordionCard.Title = AccordionTitle;
AccordionCard.Title.displayName = 'AccordionCard.Title';

AccordionCard.Content = CardContent;
AccordionCard.Content.displayName = 'AccordionCard.Content';

// AccordionCard.SubItem = AccordionSubItem;
