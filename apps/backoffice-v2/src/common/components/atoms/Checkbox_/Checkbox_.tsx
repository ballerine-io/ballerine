import { ComponentPropsWithoutRef, ElementRef, forwardRef } from 'react';
import { ctw } from '@/common/utils/ctw/ctw';
import { Check, Minus } from 'lucide-react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';

export const Checkbox_ = forwardRef<
  ElementRef<typeof CheckboxPrimitive.Root>,
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, checked, onCheckedChange, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={ctw(
      'peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
      className,
    )}
    checked={checked}
    onCheckedChange={onCheckedChange}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={ctw('flex items-center justify-center text-current')}>
      {checked === 'indeterminate' && <Minus className={`d-4`} />}
      {checked === true && <Check className={`d-4`} />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox_.displayName = CheckboxPrimitive.Root.displayName;
