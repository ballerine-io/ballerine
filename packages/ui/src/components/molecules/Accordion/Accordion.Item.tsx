import * as React from 'react';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ctw } from '@/common';

export const AccordionItem = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={ctw('border-b', className)} {...props} />
));

AccordionItem.displayName = 'AccordionItem';
