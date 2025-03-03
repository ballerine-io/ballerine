import { ctw } from '@/common/utils/ctw/ctw';
import { ComponentProps, FunctionComponent } from 'react';
import { Loader2, ScanText, Sparkles } from 'lucide-react';
import { Tooltip } from '@/common/components/atoms/Tooltip/Tooltip';
import { TooltipTrigger } from '@/common/components/atoms/Tooltip/Tooltip.Trigger';
import { TooltipContent } from '@/common/components/atoms/Tooltip/Tooltip.Content';
import { TooltipProvider } from '@/common/components/atoms/Tooltip/Tooltip.Provider';

export interface IImageOCR extends ComponentProps<'button'> {
  onOcrPressed?: () => void;
  isOcrDisabled: boolean;
  isLoadingOCR?: boolean;
}

export const ImageOCR: FunctionComponent<IImageOCR> = ({
  isOcrDisabled,
  onOcrPressed,
  className,
  isLoadingOCR,
  ...props
}) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            {...props}
            type="button"
            className={ctw(
              'btn btn-circle btn-sm relative focus:outline-primary',
              'transition-all duration-200',
              'disabled:cursor-not-allowed disabled:opacity-60',
              className,
            )}
            onClick={onOcrPressed}
            disabled={isOcrDisabled || isLoadingOCR}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-700" />

            {isLoadingOCR ? (
              <Loader2 className="relative z-10 animate-spin stroke-white" />
            ) : (
              <div className="relative z-10">
                <ScanText className="text-white" />
                <div className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-blue-400/80" />
              </div>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="center"
          className="max-w-48 rounded-xl border border-indigo-200 bg-white/95 p-2 text-xs shadow-lg"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-indigo-700">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              <span className="font-medium">AI Document Recognition</span>
            </div>
            <p className="max-w-full text-gray-600">
              Our AI can detect documents and prefill data for faster verification.
            </p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
