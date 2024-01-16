import { ComponentProps, FunctionComponent } from 'react';
import { Card } from '@/components';
import { AccordionTitle } from '@/components/molecules/AccordionCard/AccordionCard.Title';
import { AccordionCardContent } from '@/components/molecules/AccordionCard/AccordionCard.Content';
import { AccordionItem } from '@/components/molecules/AccordionCard/AccordionCard.Item';

export const AccordionCard: FunctionComponent<ComponentProps<typeof Card>> = ({
  children,
  ...props
}) => {
  return <Card {...props}>{children}</Card>;
};
AccordionCard.displayName = 'AccordionCard';

AccordionCard.Title = AccordionTitle;
AccordionCard.Title.displayName = 'AccordionCard.Title';

AccordionCard.Content = AccordionCardContent;
AccordionCard.Content.displayName = 'AccordionCard.Content';

AccordionCard.Item = AccordionItem;
