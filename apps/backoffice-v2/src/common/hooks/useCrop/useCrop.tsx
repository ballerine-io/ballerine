import { useCallback, useState } from 'react';
import { Crop } from 'react-image-crop';
import { useToggle } from '../useToggle/useToggle';
import { useDocumentListener } from '../useDocumentListener/useDocumentListener';

export const useCrop = () => {
  const [crop, setCrop] = useState<Crop>();
  const [isCropping, toggleIsCropping, toggleOnIsCropping, toggleOffIsCropping] = useToggle();
  const onCrop = useCallback((crop: Crop | undefined) => {
    setCrop(crop);
  }, []);
  const onCancelCrop = useCallback(() => {
    toggleOffIsCropping();
    onCrop(undefined);
  }, [onCrop, toggleOffIsCropping]);
  const cropImage = useCallback(
    async (image: HTMLImageElement) => {
      if (!image || !crop) return;

      const canvas = document.createElement('canvas');

      // Calculate the canvas dimensions
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      canvas.width = crop.width;
      canvas.height = crop.height;

      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Handle pixel ratio
      const pixelRatio = window.devicePixelRatio;

      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';

      // Draw the cropped image
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height,
      );

      onCrop(undefined);

      // Return cropped image as base64
      return canvas.toDataURL('image/png');
    },
    [crop, onCrop],
  );

  // Cancel cropping on escape key
  useDocumentListener('keydown', event => {
    if (event.key !== 'Escape') return;

    onCancelCrop();
  });

  return {
    crop,
    onCrop,
    onCancelCrop,
    isCropping,
    toggleIsCropping,
    toggleOnIsCropping,
    toggleOffIsCropping,
    cropImage,
  };
};
