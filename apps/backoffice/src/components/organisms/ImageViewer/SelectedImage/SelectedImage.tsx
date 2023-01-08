import { FunctionComponent, SyntheticEvent, useCallback, useState } from 'react';
import ReactCrop, { Crop } from 'react-image-crop';
import { Button } from '@mantine/core';
import { ISelectedImageProps } from './interfaces';
import { useSelectedImage } from './hooks/useSelectedImage/useSelectedImage';
import { BallerineImage } from '../../../atoms/BallerineImage/BallerineImage';
import 'react-image-crop/dist/ReactCrop.css';
import { createWorker } from 'tesseract.js';
import { notificationProvider } from '@pankod/refine-mantine';

const worker = createWorker();
const ocrInitPromise = async () => {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');
};

const cropImage = async (image: HTMLImageElement, crop: Crop) => {
  const canvas = document.createElement('canvas');
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const pixelRatio = window.devicePixelRatio;
  canvas.width = crop.width * pixelRatio;
  canvas.height = crop.height * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  ctx.imageSmoothingQuality = 'high';

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

  // Converting to base64
  const base64Image = canvas.toDataURL('image/png');
  await ocrInitPromise();
  const { data } = await worker.recognize(base64Image);
  notificationProvider().open({ message: `"${data.text}" Copied to clipboard!`, type: 'success' });
  await navigator.clipboard.writeText(data.text);
};

const b64toBlob = (b64Data: string, sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: 'image/png' });
  return blob;
};

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
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [cropActive, setCropActive] = useState(false);
  const { sx, imageProps = {}, initialImage, ZoomButton, OcrButton, ...rest } = props;
  const { sx: imageSx, ...restImage } = imageProps;
  const { selectedImage, toggleOnZoomModal } = useSelectedImage(initialImage);

  const toggleCropActive = useCallback(() => {
    setCropActive(!cropActive);
  }, [cropActive]);

  const saveCrop = async () => {
    if (!image || !crop) return;
    await cropImage(image, crop);
  };

  const onImageLoad = (evt: SyntheticEvent) => {
    const evtImage = evt.target as HTMLImageElement;
    setImage(evtImage);
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
          onLoad={onImageLoad}
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
