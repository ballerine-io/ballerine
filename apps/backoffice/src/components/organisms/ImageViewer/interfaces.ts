import { PropsWithChildren } from 'react';
import { FlexProps } from '@mantine/core';
import { ImageItem } from './ImageItem/ImageItem';
import { SelectedImage } from './SelectedImage/SelectedImage';
import { ImageList } from './ImageList/ImageList';
import { ZoomModal } from './ZoomModal/ZoomModal';

export interface IImageViewerProps extends PropsWithChildren, FlexProps {}

/**
 * Components available through dot notation i.e. ImageViewer.ImageList
 */
export interface IImageViewerChildren {
  ImageList: typeof ImageList;
  ImageItem: typeof ImageItem;
  SelectedImage: typeof SelectedImage;
  ZoomModal: typeof ZoomModal;
}
