import { ComponentProps, FunctionComponent } from 'react';
import { Image } from '../../atoms/Image';
import { PercentCrop, PixelCrop } from 'react-image-crop';
export interface TransformableImageProps extends ComponentProps<typeof Image> {
  crop: PixelCrop;
  completedCrop: PixelCrop;
  onCrop: (percentageCrop: PercentCrop | undefined) => void;
  onCompletedCrop: (crop: PixelCrop, percentCrop: PercentCrop) => void;
  onCropDone: (dataUrl: string) => string;
  isDisabled?: boolean;
  CropButton?: FunctionComponent<
    ComponentProps<'button'> & {
      isCropping: boolean;
      toggleIsCropping: (next?: boolean) => () => void;
    }
  >;
}
