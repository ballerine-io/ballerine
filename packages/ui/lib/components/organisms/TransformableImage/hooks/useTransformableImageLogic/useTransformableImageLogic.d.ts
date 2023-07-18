/// <reference types="react" />
import { PercentCrop, PixelCrop } from 'react-image-crop';
export declare const useTransformableImageLogic: ({
  onCrop,
  onCropDone,
  completedCrop,
}: {
  onCrop: (percentageCrop: PercentCrop | undefined) => void;
  onCropDone: (dataUrl: string) => string;
  completedCrop: PixelCrop;
}) => {
  isCropping: boolean;
  toggleIsCropping: (next: any) => () => void;
  toggleIsCroppingFalse: () => void;
  toggleIsCroppingTrue: () => void;
  onCropConfirm: (image: HTMLImageElement) => () => void;
  onTransformed: (
    ref: import('react-zoom-pan-pinch').ReactZoomPanPinchRef,
    state: {
      scale: number;
      positionX: number;
      positionY: number;
    },
  ) => void;
  imageRef: import('react').MutableRefObject<HTMLImageElement>;
  rotate: number;
  onRotate: () => void;
};
