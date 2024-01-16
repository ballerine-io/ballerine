import { ComponentProps, ReactNode } from 'react';
import { AccordionItem as ShadCNAccordionItem } from '@/components/molecules/Accordion/Accordion.Item';
import { Accordion } from '@/components/molecules/Accordion/Accordion';
import { Card, CardContent, CardTitle } from '@/components';
import { AccordionContent } from '@/components/molecules/Accordion/Accordion.Content';
import { AccordionTrigger } from '@/components/molecules/Accordion/Accordion.Trigger';

export type AccordionCardItemProps = ComponentProps<typeof ShadCNAccordionItem> & {
  title: string;
  subitems: Array<{
    leftIcon?: ReactNode | ReactNode[];
    text: ReactNode | ReactNode[];
    rightIcon?: ReactNode | ReactNode[];
  }>;
  accordionTriggerProps?: ComponentProps<typeof AccordionTrigger>;
  accordionContentProps?: ComponentProps<typeof AccordionContent>;
  ulProps?: ComponentProps<'ul'>;
  liProps?: ComponentProps<'li'>;
};

export type AccordionCardContentProps = Omit<
  ComponentProps<typeof Accordion>,
  'type' | 'value' | 'onValueChange'
> & {
  cardProps?: ComponentProps<typeof CardContent>;
};

export type AccordionTitle = ComponentProps<typeof CardTitle> & {
  cardTitleProps?: ComponentProps<typeof CardTitle>;
};

export type AccordionCardProps = ComponentProps<typeof Card> & {
  value?: ComponentProps<typeof Accordion>['value'];
  onValueChange?: ComponentProps<typeof Accordion>['onValueChange'];
};
