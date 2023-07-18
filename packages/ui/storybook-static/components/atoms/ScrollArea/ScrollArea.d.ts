import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
interface Props extends ScrollAreaPrimitive.ScrollAreaProps {
  orientation: 'vertical' | 'horizontal' | 'both';
}
export declare const ScrollArea: React.ForwardRefExoticComponent<
  Props & React.RefAttributes<never>
>;
export {};
