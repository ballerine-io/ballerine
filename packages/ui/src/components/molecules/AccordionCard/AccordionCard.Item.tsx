import { FunctionComponent } from 'react';
import { AccordionTrigger } from '@/components/molecules/Accordion/Accordion.Trigger';
import { AccordionContent } from '@/components/molecules/Accordion/Accordion.Content';
import { AccordionItem as ShadCNAccordionItem } from '@/components/molecules/Accordion/Accordion.Item';
import { ctw } from '@/utils';
import { AccordionCardItemProps } from '@/components/molecules/AccordionCard/types';
import { ScrollArea } from '@/components';
import { isNonEmptyArray } from '@ballerine/common';

export const AccordionCardItem: FunctionComponent<AccordionCardItemProps> = ({
  title,
  value,
  subitems,
  accordionTriggerProps,
  accordionContentProps,
  ulProps,
  liProps,
  contentFallback = <span className={`text-slate-400`}>No content</span>,
  ...props
}) => {
  return (
    <ShadCNAccordionItem
      {...props}
      value={value}
      className={ctw(`last-of-type:border-b-0`, props?.className)}
    >
      <AccordionTrigger
        {...accordionTriggerProps}
        className={ctw(
          `[&[data-state=closed]>svg]:rotate-[-90deg] [&[data-state=open]>svg]:rotate-0`,
          accordionTriggerProps?.className,
        )}
      >
        {title}
      </AccordionTrigger>
      <AccordionContent {...accordionContentProps}>
        <ScrollArea orientation="vertical" className={`h-32`}>
          <ul {...ulProps} className={ctw(`flex flex-col space-y-2`, ulProps?.className)}>
            {!isNonEmptyArray(subitems) && (
              <li className={ctw(`flex items-center gap-x-2`, liProps?.className)} {...liProps}>
                {contentFallback}
              </li>
            )}
            {isNonEmptyArray(subitems) &&
              subitems.map(({ leftIcon, text, rightIcon }, index) => (
                <li
                  className={ctw(`flex items-center gap-x-2`, liProps?.className)}
                  key={typeof text === 'string' ? `${text}-${index}` : index}
                  {...liProps}
                >
                  {leftIcon}
                  {text}
                  {rightIcon}
                </li>
              ))}
          </ul>
        </ScrollArea>
      </AccordionContent>
    </ShadCNAccordionItem>
  );
};
AccordionCardItem.displayName = 'Accordion.Item';
