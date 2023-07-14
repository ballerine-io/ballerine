import 'react-image-crop/dist/ReactCrop.css';
import {
  ComponentProps,
  FunctionComponent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { Image } from '@components/atoms/Image';
import ReactCrop, { Crop, PercentCrop, PixelCrop } from 'react-image-crop';
import { Button } from '@components/atoms/Button';
import { Check, CropIcon, XIcon } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface TransformableImageProps extends ComponentProps<typeof Image> {
  crop: Crop;
  onCrop: (crop: PixelCrop | undefined, percentageCrop?: PercentCrop) => void;
  onCropDone: (dataUrl: string) => string;
  isDisabled?: boolean;
  CropButton?: FunctionComponent<
    ComponentProps<'button'> & {
      isCropping: boolean;
      toggleIsCropping: (next?: boolean) => () => void;
    }
  >;
}

export const TransformableImage: FunctionComponent<TransformableImageProps> = ({
  src,
  width,
  height,
  alt,
  crop,
  onCrop,
  onCropDone,
  isDisabled,
  CropButton,
  ...props
}) => {
  const [isCropping, setIsCropping] = useState(false);
  const onCropConfirm = useCallback(
    (image: HTMLImageElement) => () => {
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

      const dataUrl = canvas.toDataURL('image/png');

      // Cropped image as base64
      onCropDone(dataUrl);
      onCrop(undefined);
    },
    [crop, onCrop, onCropDone],
  );
  const toggleIsCropping = useCallback(
    next => () => setIsCropping(prevState => (typeof next === 'boolean' ? next : !prevState)),
    [],
  );
  const toggleIsCroppingFalse = useCallback(() => toggleIsCropping(false)(), [toggleIsCropping]);
  const toggleIsCroppingTrue = useCallback(() => toggleIsCropping(true)(), [toggleIsCropping]);
  const imageRef = useRef<HTMLImageElement>(null);

  // Cancel crop on escape
  useLayoutEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;

      onCrop(undefined);
      toggleIsCroppingFalse();
    };

    document.addEventListener('keydown', listener, false);

    return () => {
      document.removeEventListener('keydown', listener, false);
    };
  }, [onCrop, toggleIsCroppingFalse]);

  return (
    <div className={`relative`} style={{ width, height }}>
      <ReactCrop crop={crop} onChange={onCrop} disabled={!isCropping || isDisabled}>
        <Image src={src} width={width} height={height} alt={alt} ref={imageRef} {...props} />
      </ReactCrop>
      <div className={`absolute bottom-5 right-5 z-50 flex items-center space-x-2`}>
        {isCropping && (
          <Button size={`icon`} isCircle onClick={onCropConfirm(imageRef.current)}>
            <Check className={`h-6 w-6 p-0.5`} />
          </Button>
        )}
        {CropButton && <CropButton isCropping={isCropping} toggleIsCropping={toggleIsCropping} />}
        {!CropButton && (
          <Button
            size={`icon`}
            isCircle
            onClick={!isCropping ? toggleIsCroppingTrue : toggleIsCroppingFalse}
          >
            {!isCropping && <CropIcon className={`h-6 w-6 p-0.5`} />}
            {isCropping && <XIcon className={`h-6 w-6 p-0.5`} />}
          </Button>
        )}
      </div>
    </div>
  );
};
