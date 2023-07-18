import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';
import { type VariantProps } from 'class-variance-authority';
declare const Label: React.ForwardRefExoticComponent<
  Omit<LabelPrimitive.LabelProps & React.RefAttributes<HTMLLabelElement>, 'ref'> &
    VariantProps<(props?: import('class-variance-authority/dist/types').ClassProp) => string> &
    React.RefAttributes<HTMLLabelElement>
>;
export { Label };
