import { FunctionComponent } from 'react';
import * as ScrollArea from '@radix-ui/react-scroll-area';
import { IMotionScrollAreaChildren } from './interfaces';
import { Root } from './MotionScrollArea.Root';
import { TMotionScrollAreaProps } from './types';
import { ctw } from '../../../utils/ctw/ctw';

export const MotionScrollArea: FunctionComponent<TMotionScrollAreaProps> &
  IMotionScrollAreaChildren = ({ children, className, ...props }) => {
  return (
    <MotionScrollArea.Root type={'hover'} className={ctw('overflow-hidden', className)} {...props}>
      <ScrollArea.Viewport className="d-full rounded-[inherit] [&>div]:h-full">
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        className="duration-[160] flex touch-none select-none bg-base-300 p-0.5 transition-[background] ease-out data-[orientation=horizontal]:h-3 data-[orientation=vertical]:w-3 data-[orientation=horizontal]:flex-col theme-dark:bg-neutral"
        orientation="vertical"
      >
        <ScrollArea.Thumb className="before:-translate-1/2 before:d-full before:top-left-1/2 relative flex-1 rounded-md bg-primary/30 before:absolute before:min-h-[44px] before:min-w-[44px] before:content-['']" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        className="duration-[160] flex touch-none select-none bg-base-300 p-0.5 transition-[background] ease-out data-[orientation=horizontal]:h-3 data-[orientation=vertical]:w-3 data-[orientation=horizontal]:flex-col theme-dark:bg-neutral"
        orientation="horizontal"
      >
        <ScrollArea.Thumb className="relative flex-1 rounded-md bg-primary/30" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="bg-base-300" />
    </MotionScrollArea.Root>
  );
};

MotionScrollArea.Root = Root;
