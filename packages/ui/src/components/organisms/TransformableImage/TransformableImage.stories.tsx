import { TransformableImage } from './TransformableImage';
import { PercentCrop, PixelCrop } from 'react-image-crop';
import { useCallback, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from '@components/atoms/Button';

const TransformableImageWrapper = args => {
  const [crop, setCrop] = useState<PercentCrop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedImage, setCroppedImage] = useState('');
  const onCropDone = useCallback((dataUrl: string) => {
    setCroppedImage(dataUrl);
  }, []);
  const onCrop = useCallback((percentageCrop: PercentCrop) => {
    setCrop(percentageCrop);
  }, []);
  const onCompletedCrop = useCallback((pixelCrop: PixelCrop) => {
    setCompletedCrop(pixelCrop);
  }, []);

  return (
    <>
      <TransformableImage
        {...args}
        crop={crop}
        onCrop={onCrop}
        onCropDone={onCropDone}
        completedCrop={completedCrop}
        onCompletedCrop={onCompletedCrop}
      />
      {croppedImage && <img src={croppedImage} alt={'maow'} />}
    </>
  );
};

const meta = {
  component: TransformableImageWrapper,
} satisfies Meta<typeof TransformableImage>;

export default meta;

export const Default = {
  args: {
    src: '/mock-id-90deg.png',
    alt: 'Placeholder',
    width: '853px',
    height: '640px',
  },
} satisfies StoryObj<typeof TransformableImage>;

export const CustomCropButton = {
  args: {
    src: 'https://picsum.photos/600',
    alt: 'Placeholder',
    width: '600px',
    height: '600px',
    crossOrigin: 'anonymous',
    CropButton: ({ toggleIsCropping, isCropping }) => (
      <Button onClick={!isCropping ? toggleIsCropping(true) : toggleIsCropping(false)}>
        {!isCropping ? 'Crop' : 'Stop Cropping'}
      </Button>
    ),
  },
} satisfies StoryObj<typeof TransformableImage>;
