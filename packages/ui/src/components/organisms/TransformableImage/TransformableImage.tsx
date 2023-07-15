import 'react-image-crop/dist/ReactCrop.css';
import { FunctionComponent } from 'react';
import { Image } from '@components/atoms/Image';
import ReactCrop from 'react-image-crop';
import { Button } from '@components/atoms/Button';
import { Check, CropIcon, FileText, XIcon } from 'lucide-react';
import { useTransformableImageLogic } from './hooks';
import { TransformableImageProps } from './interfaces';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { ctw } from '@utils/ctw';

export const TransformableImage: FunctionComponent<TransformableImageProps> = ({
  src,
  width,
  height,
  alt,
  crop,
  completedCrop,
  onCrop,
  onCompletedCrop,
  onCropDone,
  isDisabled,
  CropButton,
  ...props
}) => {
  const {
    isCropping,
    toggleIsCropping,
    toggleIsCroppingFalse,
    toggleIsCroppingTrue,
    onCropConfirm,
    onTransformed,
    rotate,
    onRotate,
    imageRef,
  } = useTransformableImageLogic({
    onCrop,
    onCropDone,
    completedCrop,
  });

  return (
    <div className={`relative`} style={{ width, height }}>
      <ReactCrop
        crop={crop}
        onChange={(_pixelCrop, percentageCrop) => onCrop(percentageCrop)}
        onComplete={onCompletedCrop}
        disabled={!isCropping || isDisabled}
      >
        <TransformWrapper onTransformed={onTransformed}>
          <TransformComponent wrapperStyle={{ width, height }} contentStyle={{ width, height }}>
            <Image
              src={src}
              width={width}
              height={height}
              alt={alt}
              ref={imageRef}
              {...props}
              className={ctw({
                'rotate-90': rotate === 90,
                'rotate-180': rotate === 180,
                'rotate-[270deg]': rotate === 270,
              })}
            />
          </TransformComponent>
        </TransformWrapper>
      </ReactCrop>
      <div className={`absolute bottom-5 right-5 z-50 flex items-center space-x-2`}>
        <Button size={`icon`} isCircle onClick={onRotate}>
          <FileText className={`rotate-90 p-0.5`} />
        </Button>
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
