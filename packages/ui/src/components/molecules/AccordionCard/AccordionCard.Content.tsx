import { Accordion } from '@/components/molecules/Accordion/Accordion';
import { FunctionComponent } from 'react';
import { CardContent, ScrollArea } from '@/components';

import { AccordionCardContentProps } from '@/components/molecules/AccordionCard/types';
import { ctw } from '@/utils';
import { useAccordionCardContext } from '@/components/molecules/AccordionCard/context/AccordionCardProvider/hooks/useAccordionCardContext/useAccordionCardContext';

export const AccordionCardContent: FunctionComponent<AccordionCardContentProps> = ({
  children,
  cardProps,
  ...props
}) => {
  const { value, onValueChange } = useAccordionCardContext();

  return (
    <CardContent {...cardProps} className={ctw(`pb-2`, cardProps?.className)}>
      <ScrollArea orientation="vertical" className={`h-80`}>
        {/* @ts-expect-error - Can't know discriminated union type at compile-time (changes based the `type` prop) */}
        <Accordion
          type={'single'}
          collapsible
          {...props}
          value={value}
          onValueChange={onValueChange}
        >
          {children}
        </Accordion>
      </ScrollArea>
    </CardContent>
  );
};
AccordionCardContent.displayName = 'AccordionCard.Content';
