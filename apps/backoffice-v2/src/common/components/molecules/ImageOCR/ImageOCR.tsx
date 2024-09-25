import { ctw } from '@/common/utils/ctw/ctw';
import { ComponentProps, FunctionComponent } from 'react';
import { Loader2, ScanTextIcon } from 'lucide-react';

export interface IImageOCR extends ComponentProps<'div'> {
  onOcrPressed?: () => void;
  isOcrDisabled: boolean;
  isLoadingOCR?: boolean;
  documentId: string;
}

export const ImageOCR: FunctionComponent<IImageOCR> = ({
  isOcrDisabled,
  onOcrPressed,
  documentId,
  className,
  isLoadingOCR,
  ...props
}) => (
  <button
    type="button"
    className={ctw(
      'btn btn-circle btn-ghost btn-sm bg-base-300/70 text-[0.688rem] focus:outline-primary',
      isLoadingOCR,
      className,
    )}
    onClick={() => !isLoadingOCR && onOcrPressed?.()}
    disabled={isOcrDisabled || isLoadingOCR}
    {...props}
  >
    {isLoadingOCR ? <Loader2 className="animate-spin stroke-foreground" /> : <ScanTextIcon />}
  </button>
);
