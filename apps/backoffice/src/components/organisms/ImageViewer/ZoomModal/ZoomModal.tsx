import { FunctionComponent } from 'react';
import { useImageViewerContext } from '../context/hooks/useImageViewerContext/useImageViewerContext';
import { Modal } from '@mantine/core';
import { IZoomModalProps } from './interfaces';
import { BallerineImage } from '../../../atoms/BallerineImage/BallerineImage';

/**
 * @description To be used by ImageViewer. Uses Mantine's Modal component with default styling to display an enlarged version of the selected image.
 *
 * References:
 * - [Modal documentation](https://mantine.dev/core/modal/)
 * - [Image documentation](https://mantine.dev/core/image/)
 *
 * @param props - Props to pass to the root Modal component.
 * @param props.imageProps - Props to pass to the BallerineImage component.
 * @constructor
 */
export const ZoomModal: FunctionComponent<IZoomModalProps> = props => {
  const { imageProps = {}, styles, ...rest } = props;
  const { sx: imageSx, ...restImage } = imageProps;
  const { isZoomModalOpen, toggleOffZoomModal, selectedImage } = useImageViewerContext();

  return (
    <Modal
      opened={isZoomModalOpen}
      onClose={toggleOffZoomModal}
      closeButtonLabel={'Close zoom selected image modal'}
      size={'80vw'}
      overflow={'inside'}
      styles={{
        close: {
          border: '2px solid transparent',
          '&:focus': {
            outline: 'none',
            borderColor: '#1540A8',
          },
        },
        ...styles,
      }}
      {...rest}
    >
      <BallerineImage
        radius={8}
        src={selectedImage}
        sx={{
          '& img': {
            border: '2px solid transparent',
          },
          ...imageSx,
        }}
        alt={'Zoomed selected image'}
        {...restImage}
      />
    </Modal>
  );
};
