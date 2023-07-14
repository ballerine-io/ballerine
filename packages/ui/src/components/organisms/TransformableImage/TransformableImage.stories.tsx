import { TransformableImage } from './TransformableImage';
import { Crop, PercentCrop } from 'react-image-crop';
import { useCallback, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from '@components/atoms/Button';

const TransformableImageWrapper = args => {
  const [crop, setCrop] = useState<Crop>();
  const [croppedImage, setCroppedImage] = useState('');
  const onCropDone = useCallback((dataUrl: string) => {
    setCroppedImage(dataUrl);
  }, []);
  const onCrop = useCallback((crop: Crop | undefined, percentageCrop?: PercentCrop) => {
    setCrop(crop);
  }, []);

  return (
    <>
      <TransformableImage {...args} crop={crop} onCrop={onCrop} onCropDone={onCropDone} />
      {croppedImage && <img src={croppedImage} height={'150px'} width={`150px`} alt={'maow'} />}
    </>
  );
};

const meta = {
  component: TransformableImageWrapper,
} satisfies Meta<typeof TransformableImage>;

export default meta;

export const Default = {
  args: {
    src: 'https://picsum.photos/600',
    alt: 'Placeholder',
    width: '600px',
    height: '600px',
    crossOrigin: 'anonymous',
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
