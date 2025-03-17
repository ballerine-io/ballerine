import React, { ComponentProps, ReactNode } from 'react';
import { Tooltip } from '@/components';
import { TooltipTrigger } from '@/components';
import { TooltipContent } from '@/components';
import { HelpCircle } from 'lucide-react';
import { ctw, FunctionComponentWithChildren } from '@/common';

export const ContentTooltip: FunctionComponentWithChildren<{
  description: ReactNode | ReactNode[];
  props?: {
    tooltip?: ComponentProps<typeof Tooltip>;
    tooltipTrigger?: ComponentProps<typeof TooltipTrigger>;
    tooltipContent?: ComponentProps<typeof TooltipContent>;
    tooltipIcon?: ComponentProps<typeof HelpCircle>;
  };
}> = ({ description, props, children }) => {
  return (
    <Tooltip {...props?.tooltip}>
      <TooltipTrigger
        {...props?.tooltipTrigger}
        className={ctw(`flex items-center pr-3 text-base`, props?.tooltipTrigger?.className)}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent
        align={'end'}
        side={'right'}
        {...props?.tooltipContent}
        className={ctw(
          'max-w-[400px] whitespace-normal border p-4 font-normal',
          'rounded-[6px] bg-[#3D465A] shadow-[0px_4px_4px_rgba(0,0,0,0.05)]',
          props?.tooltipContent?.className,
        )}
      >
        {description}
      </TooltipContent>
    </Tooltip>
  );
};
