import { ctw } from '@/common/utils/ctw/ctw';
import { ComponentProps, FunctionComponent } from 'react';
import { Loader2, ScanTextIcon } from 'lucide-react';

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
}) => (
  <button
    {...props}
    type="button"
    className={ctw(
      'btn btn-circle btn-ghost btn-sm bg-base-300/70 text-[0.688rem] focus:outline-primary disabled:bg-base-300/70',
      isLoadingOCR,
      className,
    )}
    onClick={() => onOcrPressed?.()}
    disabled={isOcrDisabled || isLoadingOCR}
  >
    {isLoadingOCR ? (
      <Loader2 className="animate-spin stroke-foreground" />
    ) : (
      <ScanTextIcon className={'p-0.5'} />
    )}
  </button>
);
