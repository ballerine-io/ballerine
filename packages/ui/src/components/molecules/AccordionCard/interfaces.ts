import { AccordionCardTitle } from '@/components/molecules/AccordionCard/AccordionCard.Title';
import { AccordionCardContent } from '@/components/molecules/AccordionCard/AccordionCard.Content';
import { AccordionCardItem } from '@/components/molecules/AccordionCard/AccordionCard.Item';
import { AccordionCardFooter } from '@/components/molecules/AccordionCard/AccordionCard.Footer';

export interface IAccordionCardChildren {
  Title: typeof AccordionCardTitle;
  Content: typeof AccordionCardContent;
  Item: typeof AccordionCardItem;
  Footer: typeof AccordionCardFooter;
}
