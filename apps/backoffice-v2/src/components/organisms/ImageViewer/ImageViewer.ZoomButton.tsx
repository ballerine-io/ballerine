import { FunctionComponent } from 'react';
import { useZoomButton } from '@/components/organisms/ImageViewer/hooks/useZoomButton/useZoomButton';
import { ctw } from '@/utils/ctw/ctw';
import { ZoomIn } from 'lucide-react';
import { Button, ButtonProps } from '@/components/atoms/Button';

export const ZoomButton: FunctionComponent<ButtonProps<'button'>> = ({ className, ...props }) => {
  const { onToggleOnIsZoomModalOpen } = useZoomButton();

  return (
    <Button
      shape={'circle'}
      variant={'ghost'}
      onClick={onToggleOnIsZoomModalOpen}
      aria-label={'Open zoomed selected image modal'}
      className={ctw(`bg-base-300/70 !p-2`, className)}
      {...props}
    >
      <ZoomIn />
    </Button>
  );
};
