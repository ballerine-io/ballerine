import { ComponentProps, ComponentPropsWithoutRef, ComponentPropsWithRef } from 'react';
import { Item } from './ImageViewer.Item';
import { SelectedImage } from './ImageViewer.SelectedImage';
import { List } from './ImageViewer.List';
import { ZoomModal } from './ImageViewer.ZoomModal';
import { ButtonComponent, DivComponent } from '../../../types';
import { ZoomButton } from './ImageViewer.ZoomButton';
import { SkeletonItem } from './ImageViewer.SkeletonItem';

type ImgOrIframeComponentPropsWithRef =
  | ComponentPropsWithRef<'img'>
  | ComponentPropsWithRef<'iframe'>;

export interface IZoomModalProps extends DivComponent {
  imageProps?: Omit<ImgOrIframeComponentPropsWithRef, 'src'>;
}

export type TSelectedImageProps = ImgOrIframeComponentPropsWithRef & {
  // The image to show before a selection is made by the operator.
  initialImage: {
    imageUrl: string;
    fileType: string;
  };
  isLoading?: boolean;
};

export interface IItemProps extends Omit<ComponentProps<'li'>, 'children'> {
  caption: string;
  src: string;
  fileType: string;
  fileName: string;
  alt: string;
  buttonProps?: ButtonComponent;
  imageProps?: Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'>;
}

export interface IImageViewerProps extends ComponentProps<'div'> {
  selectedImage: {
    imageUrl: string;
    fileType: string;
  };
  onSelectImage: (next: { imageUrl: string; fileType: string }) => () => void;
}

/**
 * Components available through dot notation i.e. ImageViewer.List
 */
export interface IImageViewerChildren {
  List: typeof List;
  Item: typeof Item;
  SkeletonItem: typeof SkeletonItem;
  SelectedImage: typeof SelectedImage;
  ZoomModal: typeof ZoomModal;
  ZoomButton: typeof ZoomButton;
}
