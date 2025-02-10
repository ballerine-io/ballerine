import { isCsv } from '@/common/utils/is-csv/is-csv';
import { FunctionComponent } from 'react';
import { ctw } from '../../../utils/ctw/ctw';
import { isPdf } from '../../../utils/is-pdf/is-pdf';
import { BallerineImage } from '../../atoms/BallerineImage';
import { Modal } from '../Modal/Modal';
import { useImageViewerContext } from './hooks/useImageViewerContext/useImageViewerContext';
import { IZoomModalProps } from './interfaces';

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
      {(isPdf(selectedImage) || isCsv(selectedImage)) && (
        <iframe
          src={`${selectedImage?.imageUrl}${isCsv(selectedImage) ? '#toolbar=0&navpanes=0' : ''}`}
          className={ctw(`d-full`, imageClassName)}
          {...restImage}
        />
      )}
      {!isPdf(selectedImage) && !isCsv(selectedImage) && (
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
