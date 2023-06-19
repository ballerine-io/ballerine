import { FunctionComponent } from 'react';
import { SelectedImage } from './ImageViewer.SelectedImage';
import { IImageViewerChildren, IImageViewerProps } from './interfaces';
import { List } from './ImageViewer.List';
import { Item } from './ImageViewer.Item';
import { ZoomModal } from './ImageViewer.ZoomModal';
import { Provider } from './context';
import { ZoomButton } from './ImageViewer.ZoomButton';
import { SkeletonItem } from './ImageViewer.SkeletonItem';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description A component that displays a list of images and a zoomable selected image using a shared context.
 * Uses dot notation for its API (i.e. ImageViewer.List), where the root component acts as a context provider and container.
 *
 * Children:
 * - {@link ImageViewer.List} - Wraps multiple {@link ImageViewer.Item} with a ul element.
 * - {@link ImageViewer.Item} - An li with a single image, sets the selected image on click.
 * - {@link ImageViewer.SelectedImage} - Displays the selected image.
 * - {@link ImageViewer.ZoomModal} - Displays an enlarged selected image in a modal, opened by clicking on the selected image or its zoom button.
 *
 * @see {@link https://reactjs.org/docs/jsx-in-depth.html#using-dot-notation-for-jsx-type|React dot notation}
 *
 * @param props
 * @constructor
 */
export const ImageViewer: FunctionComponent<IImageViewerProps> & IImageViewerChildren = ({
  children,
  className,
  selectedImage,
  onSelectImage,
  ...rest
}) => {
  return (
    <div className={ctw(`flex h-full flex-col items-center gap-y-8`, className)} {...rest}>
      <Provider selectedImage={selectedImage} onSelectImage={onSelectImage}>
        {children}
      </Provider>
    </div>
  );
};

ImageViewer.List = List;
ImageViewer.Item = Item;
ImageViewer.SkeletonItem = SkeletonItem;
ImageViewer.SelectedImage = SelectedImage;
ImageViewer.ZoomModal = ZoomModal;
ImageViewer.ZoomButton = ZoomButton;
