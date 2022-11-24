import { FunctionComponent } from 'react';
import { Flex } from '@mantine/core';
import { ImageList } from './ImageList/ImageList';
import { SelectedImage } from './SelectedImage/SelectedImage';
import { ImageItem } from './ImageItem/ImageItem';
import { IImageViewerChildren, IImageViewerProps } from './interfaces';
import { Provider } from './context/Provider';
import { ZoomModal } from './ZoomModal/ZoomModal';

/**
 * @description A component that displays a list of images and a selected image using Mantine.
 * Uses dot notation for its API (i.e. ImageViewer.ImageList), where the root component acts as a context provider and container.
 *
 * Children:
 * - ImageItem - A single image, sets the selected image on click.
 * - ImageList - Wraps multiple ImageItem.
 * - SelectedImage - Displays the selected image.
 *
 * References:
 * - [React dot notation](https://reactjs.org/docs/jsx-in-depth.html#using-dot-notation-for-jsx-type)
 * - [Flex documentation](https://mantine.dev/core/flex/)
 * @param props
 * @constructor
 */
export const ImageViewer: FunctionComponent<IImageViewerProps> & IImageViewerChildren = props => {
  const { children, sx = {}, ...rest } = props;

  return (
    <Flex
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
        rowGap: 24,
        ...sx,
      }}
      {...rest}
    >
      <Provider>{children}</Provider>
    </Flex>
  );
};

ImageViewer.ImageList = ImageList;
ImageViewer.ImageItem = ImageItem;
ImageViewer.SelectedImage = SelectedImage;
ImageViewer.ZoomModal = ZoomModal;
