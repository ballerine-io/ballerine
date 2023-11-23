import { ctw } from '@/common/utils/ctw/ctw';
import * as React from 'react';
import { useFormField } from './hooks/useFormField/useFormField';

export const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={ctw('text-muted-foreground text-sm', className)}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';
