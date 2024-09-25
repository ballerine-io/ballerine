import { ctw } from '@/common/utils/ctw/ctw';
import { ComponentProps, FunctionComponent } from 'react';
import { ScanTextIcon } from 'lucide-react';

export interface IImageOCR extends ComponentProps<'div'> {
  onOcrPressed?: (documentId: string) => void;
  isOcrDisabled: boolean;
  documentId: string;
}

export const ImageOCR: FunctionComponent<IImageOCR> = ({
  isOcrDisabled,
  onOcrPressed,
  documentId,
  className,
  ...props
}) => (
  <>
    <button
      type={`button`}
      className={ctw(
        `btn btn-circle btn-ghost btn-sm bg-base-300/70 text-[0.688rem] focus:outline-primary`,
      )}
      onClick={() => onOcrPressed?.(documentId)}
      disabled={isOcrDisabled}
    >
      <ScanTextIcon />
    </button>
  </>
);
