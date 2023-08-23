import { FunctionComponent } from 'react';
import { useImageViewerContext } from './hooks/useImageViewerContext/useImageViewerContext';
import { IZoomModalProps } from './interfaces';
import { Modal } from '../Modal/Modal';
import { BallerineImage } from '../../atoms/BallerineImage';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description To be used by {@link ImageViewer}. Uses the {@link Modal} component with default styling to display an enlarged version of the selected image.
 *
 * @see {@link Modal}
 *
 * @param props - Props to pass to the {@link Dialog.Content} component.
 * @param props.imageProps - Props to pass to the {@link BallerineImage} component.
 *
 * @constructor
 */
export const ZoomModal: FunctionComponent<IZoomModalProps> = ({
  imageProps = {},
  className,
  ...rest
}) => {
  const { className: imageClassName, ...restImage } = imageProps;
  const { selectedImage, isZoomModalOpen, toggleIsZoomModalOpen } = useImageViewerContext();

  return (
    <Modal
      title={`Zoomed selected image modal`}
      isOpen={isZoomModalOpen}
      onIsOpenChange={toggleIsZoomModalOpen}
      className={className}
      hideTitle
      {...rest}
    >
      {(selectedImage?.fileType === 'pdf' || selectedImage?.imageUrl?.endsWith('.pdf')) && (
        <iframe
          src={selectedImage?.imageUrl}
          className={ctw(`d-full`, imageClassName)}
          {...restImage}
        />
      )}
      {selectedImage?.fileType !== 'pdf' && !selectedImage?.imageUrl?.endsWith('.pdf') && (
        <BallerineImage
          withPlaceholder
          src={selectedImage?.imageUrl}
          alt={'Zoomed selected image'}
          className={ctw(
            `w-full`,
            {
              'h-full': !selectedImage?.imageUrl,
            },
            imageClassName,
          )}
          {...restImage}
        />
      )}
    </Modal>
  );
};
