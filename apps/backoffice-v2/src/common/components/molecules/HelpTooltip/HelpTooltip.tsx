import React, { ComponentProps, FunctionComponent, ReactNode } from 'react';
import { TooltipProvider } from '@/common/components/atoms/Tooltip/Tooltip.Provider';
import { Tooltip } from '@/common/components/atoms/Tooltip/Tooltip';
import { TooltipTrigger } from '@/common/components/atoms/Tooltip/Tooltip.Trigger';
import { TooltipContent } from '@/common/components/atoms/Tooltip/Tooltip.Content';
import { HelpCircle } from 'lucide-react';
import { ctw } from '@/common/utils/ctw/ctw';

export const HelpTooltip: FunctionComponent<{
  title: ReactNode | ReactNode[];
  description: ReactNode | ReactNode[];
  props?: {
    tooltipProvider?: ComponentProps<typeof TooltipProvider>;
    tooltip?: ComponentProps<typeof Tooltip>;
    tooltipTrigger?: ComponentProps<typeof TooltipTrigger>;
    tooltipContent?: ComponentProps<typeof TooltipContent>;
    tooltipIcon?: ComponentProps<typeof HelpCircle>;
    contentHeading?: ComponentProps<'h4'>;
    contentParagraph?: ComponentProps<'p'>;
  };
}> = ({ title, description, props }) => {
  return (
    <TooltipProvider delayDuration={0} {...props?.tooltipProvider}>
      <Tooltip {...props?.tooltip}>
        <TooltipTrigger
          {...props?.tooltipTrigger}
          className={ctw(`flex items-center`, props?.tooltipTrigger?.className)}
        >
          <HelpCircle
            size={18}
            {...props?.tooltipIcon}
            className={ctw(`stroke-slate-400/70`, props?.tooltipIcon?.className)}
          />
        </TooltipTrigger>
        <TooltipContent
          align={'end'}
          {...props?.tooltipContent}
          className={ctw(
            'border bg-background p-4 font-normal text-foreground shadow-sm',
            props?.tooltipContent?.className,
          )}
        >
          <h4
            {...props?.contentHeading}
            className={ctw('mb-4 font-bold', props?.contentHeading?.className)}
          >
            {title}
          </h4>
          <p
            {...props?.contentParagraph}
            className={ctw(
              'w-[35ch] break-words leading-relaxed',
              props?.contentParagraph?.className,
            )}
          >
            {description}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
