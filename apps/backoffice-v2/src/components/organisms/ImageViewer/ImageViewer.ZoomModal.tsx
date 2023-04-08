import { FunctionComponent } from 'react';
import { useImageViewerContext } from './hooks/useImageViewerContext/useImageViewerContext';
import { IZoomModalProps } from './interfaces';
import { BallerineImage } from '@/components/atoms/BallerineImage';
import { ctw } from '@/utils/ctw/ctw';
import { Dialog } from '@/components/molecules/Dialog/Dialog';
import { DialogContent } from '@/components/molecules/Dialog/Dialog.Content';
import { DialogHeader } from '@/components/molecules/Dialog/Dialog.Header';
import { DialogTitle } from '@/components/molecules/Dialog/Dialog.Title';

/**
 * @description To be used by {@link ImageViewer}. Uses the {@link Modal} component with default styling to display an enlarged version of the selected image.
 *
 * @see {@link Dialog}
 *
 * @param props - Props to pass to the {@link Dialog.Content} component.
 * @param props.imageProps - Props to pass to the {@link BallerineImage} component.
 *
 * @constructor
 */
export const ZoomModal: FunctionComponent<IZoomModalProps> = ({ imageProps = {}, ...rest }) => {
  const { className: imageClassName, ...restImage } = imageProps;
  const { selectedImage, isZoomModalOpen, toggleIsZoomModalOpen } = useImageViewerContext();

  return (
    <Dialog open={isZoomModalOpen} onOpenChange={toggleIsZoomModalOpen} {...rest}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className={`sr-only`}>Zoomed selected image modal</DialogTitle>
        </DialogHeader>
        <BallerineImage
          withPlaceholder
          src={selectedImage}
          alt={'Zoomed selected image'}
          className={ctw(
            `w-full`,
            {
              'h-full': !selectedImage,
            },
            imageClassName,
          )}
          {...restImage}
        />
      </DialogContent>
    </Dialog>
  );
};
