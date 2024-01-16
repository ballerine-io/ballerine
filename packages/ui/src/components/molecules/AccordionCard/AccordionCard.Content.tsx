import { Accordion } from '@/components/molecules/Accordion/Accordion';
import { ComponentProps, FunctionComponent } from 'react';
import { CardContent } from '@/components';

export interface IAccordionCardContentProps {
  children: ComponentProps<typeof Accordion>;
}

export const AccordionCardContent: FunctionComponent<IAccordionCardContentProps> = () => {
  return (
    <CardContent>
      <Accordion type={'multiple'}></Accordion>
    </CardContent>
  );
};
