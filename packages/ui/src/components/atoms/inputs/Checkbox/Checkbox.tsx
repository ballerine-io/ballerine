import { ctw } from '@/common/utils/ctw';
import { Indicator, Root } from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';
import * as React from 'react';

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof Root>,
  React.ComponentPropsWithoutRef<typeof Root>
>(({ className, ...props }, ref) => (
  <Root
    ref={ref}
    className={ctw(
      'border-slate-900 ring-offset-background focus-visible:ring-ring data-[state=checked]:bg-white data-[state=checked]:text-slate-900 peer h-4 w-4 shrink-0 rounded-sm border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
      className,
    )}
    {...props}
  >
    <Indicator className={ctw('flex items-center justify-center text-current')}>
      <Check className="h-4 w-4" />
    </Indicator>
  </Root>
));
