import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { useFormField } from './hooks/useFormField/useFormField';
import { Label } from '@/components/atoms/Label/Label';
import { ctw } from '@/common/utils/ctw/ctw';

export const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();

  return (
    <Label
      ref={ref}
      className={ctw(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  );
});
FormLabel.displayName = 'FormLabel';
