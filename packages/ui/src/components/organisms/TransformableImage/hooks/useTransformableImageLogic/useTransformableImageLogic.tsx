import { PercentCrop, PixelCrop } from 'react-image-crop';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ReactZoomPanPinchProps } from 'react-zoom-pan-pinch';

export const useTransformableImageLogic = ({
  onCrop,
  onCropDone,
  completedCrop,
}: {
  onCrop: (percentageCrop: PercentCrop | undefined) => void;
  onCropDone: (dataUrl: string) => string;
  completedCrop: PixelCrop;
}) => {
  const [rotate, setRotate] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const [transformations, setTransformations] = useState<
    Parameters<ReactZoomPanPinchProps['onTransformed']>[1]
  >({
    positionX: 0,
    positionY: 0,
    scale: 1,
  });
  const onRotate = useCallback(() => {
    setRotate(prevState => {
      if (prevState === 270) {
        return 0;
      }

      return prevState + 90;
    });
  }, []);
  const toggleIsCropping = useCallback(
    next => () => setIsCropping(prevState => (typeof next === 'boolean' ? next : !prevState)),
    [],
  );
  const toggleIsCroppingFalse = useCallback(() => toggleIsCropping(false)(), [toggleIsCropping]);
  const toggleIsCroppingTrue = useCallback(() => toggleIsCropping(true)(), [toggleIsCropping]);
  const cancelCropping = useCallback(() => {
    toggleIsCroppingFalse();
    onCrop(undefined);
  }, [onCrop, toggleIsCroppingFalse]);
  const canvasPreview = ({
    image,
    canvas,
    crop,
    scale = 1,
    rotate = 0,
    positionX = 0,
    positionY = 0,
  }: {
    image: HTMLImageElement;
    canvas: HTMLCanvasElement;
    crop: PixelCrop;
    scale?: number;
    rotate?: number;
    positionX?: number;
    positionY?: number;
  }) => {
    const ctx = canvas.getContext('2d');
    const TO_RADIANS = Math.PI / 180;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    // devicePixelRatio slightly increases sharpness on retina devices
    // at the expense of slightly slower render times and needing to
    // size the image back down if you want to download/upload and be
    // true to the images natural size.
    const pixelRatio = window.devicePixelRatio;
    // const pixelRatio = 1

    canvas.width = Math.floor(crop.width * scaleX * pixelRatio);
    canvas.height = Math.floor(crop.height * scaleY * pixelRatio);

    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = 'high';

    const cropX = crop.x * scaleX;
    const cropY = crop.y * scaleY;

    const rotateRads = rotate * TO_RADIANS;
    const centerX = image.naturalWidth / 2;
    const centerY = image.naturalHeight / 2;

    ctx.save();

    // 5) Move the crop origin to the canvas origin (0,0)
    ctx.translate(-cropX, -cropY);
    // 4) Move the origin to the center of the original position
    ctx.translate(centerX, centerY);
    // 3) Rotate around the origin
    ctx.rotate(rotateRads);
    // 2) Scale the image
    ctx.scale(scale, scale);
    // 1) Move the center of the image to the origin (0,0)
    ctx.translate(-centerX, -centerY);
    ctx.drawImage(
      image,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
      0,
      0,
      image.naturalWidth,
      image.naturalHeight,
    );

    ctx.restore();
  };
  const onCropConfirm = useCallback(
    (image: HTMLImageElement) => () => {
      const canvas = document.createElement('canvas');

      canvasPreview({
        image,
        canvas,
        crop: completedCrop,
        rotate,
        scale: transformations.scale,
        positionX: transformations.positionX,
        positionY: transformations.positionY,
      });

      const dataUrl = canvas.toDataURL('image/png');

      // Cropped image as base64
      onCropDone(dataUrl);
      cancelCropping();
    },
    [
      completedCrop,
      transformations.scale,
      transformations.positionX,
      transformations.positionY,
      rotate,
      onCropDone,
      cancelCropping,
    ],
  );
  const onTransformed: ReactZoomPanPinchProps['onTransformed'] = useCallback(
    (_ref, state) => setTransformations(state),
    [],
  );
  const imageRef = useRef<HTMLImageElement>(null);

  // Cancel crop on escape
  useLayoutEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      cancelCropping();
    };

    document.addEventListener('keydown', listener, false);

    return () => {
      document.removeEventListener('keydown', listener, false);
    };
  }, [cancelCropping]);

  return {
    isCropping,
    toggleIsCropping,
    toggleIsCroppingFalse,
    toggleIsCroppingTrue,
    onCropConfirm,
    onTransformed,
    imageRef,
    rotate,
    onRotate,
  };
};
