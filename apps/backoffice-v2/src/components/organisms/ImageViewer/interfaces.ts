import {
  ComponentProps,
  ComponentPropsWithoutRef,
  ComponentPropsWithRef,
} from 'react';
import { Item } from './ImageViewer.Item';
import { SelectedImage } from './ImageViewer.SelectedImage';
import { List } from './ImageViewer.List';
import { ZoomModal } from './ImageViewer.ZoomModal';
import { ButtonComponent, DivComponent } from '../../../types';
import { ZoomButton } from './ImageViewer.ZoomButton';
import { SkeletonItem } from 'components/organisms/ImageViewer/ImageViewer.SkeletonItem';

export interface IZoomModalProps extends DivComponent {
  imageProps?: Omit<ComponentPropsWithRef<'img'>, 'src'>;
}

export interface ISelectedImageProps extends ComponentPropsWithRef<'img'> {
  // The image to show before a selection is made by the end user.
  initialImage: string;
  isLoading?: boolean;
}

export interface IItemProps extends Omit<ComponentProps<'li'>, 'children'> {
  caption: string;
  src: string;
  alt: string;
  buttonProps?: ButtonComponent;
  imageProps?: Omit<ComponentPropsWithoutRef<'img'>, 'src' | 'alt'>;
}

export type IImageViewerProps = DivComponent;

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
