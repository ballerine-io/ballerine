import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { useFormField } from './hooks/useFormField/useFormField';
import { Label } from '../../atoms/Label/Label';

export const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { formItemId } = useFormField();

  return <Label ref={ref} className={className} htmlFor={formItemId} {...props} />;
});

FormLabel.displayName = 'FormLabel';
