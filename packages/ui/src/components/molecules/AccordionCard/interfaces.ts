import { AccordionCardTitle } from '@/components/molecules/AccordionCard/AccordionCard.Title';
import { AccordionCardContent } from '@/components/molecules/AccordionCard/AccordionCard.Content';
import { AccordionCardItem } from '@/components/molecules/AccordionCard/AccordionCard.Item';

export interface IAccordionCardChildren {
  Title: typeof AccordionCardTitle;
  Content: typeof AccordionCardContent;
  Item: typeof AccordionCardItem;
}
