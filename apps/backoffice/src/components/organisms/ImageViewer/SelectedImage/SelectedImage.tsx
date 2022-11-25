import { FunctionComponent, useCallback, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { Button } from '@mantine/core';
import { ISelectedImageProps } from './interfaces';
import { useSelectedImage } from './hooks/useSelectedImage/useSelectedImage';
import { BallerineImage } from '../../../atoms/BallerineImage/BallerineImage';
import 'react-image-crop/dist/ReactCrop.css';

/**
 * @description To be used by ImageViewer. Uses Mantine's Image component to display the currently selected image with default styling.
 *
 * References:
 * - https://mantine.dev/core/box/
 * - https://mantine.dev/core/image/
 * @param props
 * @constructor
 */
export const SelectedImage: FunctionComponent<ISelectedImageProps> = props => {
  const [crop, setCrop] = useState<Crop>();
  const [cropActive, setCropActive] = useState(false);
  const { sx, imageProps = {}, initialImage, ZoomButton, OcrButton, ...rest } = props;
  const { sx: imageSx, ...restImage } = imageProps;
  const { selectedImage, toggleOnZoomModal } = useSelectedImage(initialImage);

  const toggleCropActive = useCallback(() => {
    setCropActive(!cropActive);
  }, [cropActive]);

  const saveCrop = () => {
    console.log(crop);
  };

  return (
    <Button
      unstyled
      sx={{
        cursor: 'pointer',
        padding: 0,
        borderColor: 'transparent',
        backgroundColor: 'transparent',
        position: 'relative',
        '&:focus-visible': {
          outline: 'none',
        },
        '&:hover img, &:focus-within img': {
          borderColor: '#1540A8',
          boxShadow: '0px 4px 16px 0px #6574FF4D',
        },
        maxWidth: 500,
        ...sx,
      }}
      aria-label={'Open zoom selected image modal'}
      {...rest}
    >
      <ReactCrop crop={crop} onChange={c => setCrop(c)} disabled={!cropActive}>
        <BallerineImage
          src={selectedImage}
          alt={'Selected image'}
          sx={{
            '& img': {
              border: '2px solid transparent',
            },
            ...imageSx,
          }}
          {...restImage}
        />
      </ReactCrop>
      <ZoomButton onClick={toggleOnZoomModal} aria-label={'Open zoom selected image modal'} />
      <OcrButton
        onClick={!crop ? toggleCropActive : saveCrop}
        isSubmittable={!!crop}
        aria-label={'Open crop selected image view'}
      />
    </Button>
  );
};
