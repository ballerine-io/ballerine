import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, VariantProps } from 'class-variance-authority';
import { ctw } from '../../../utils/ctw/ctw';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
);

export const Label = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={ctw(labelVariants(), className)} {...props} />
));
Label.displayName = LabelPrimitive.Root.displayName;
