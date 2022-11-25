import { MagnifyingGlassButton } from 'components/atoms/MagnifyingGlassButton/MagnifyingGlassButton';
import { OcrButton } from 'components/atoms/OcrButton';
import { ImageViewer } from 'components/organisms/ImageViewer/ImageViewer';
import { FC } from 'react';
import { OcrToggle } from '../OcrToggle';
import styles from './SubjectImageViewer.module.css';

interface Props {
  isLoading: boolean;
  ocrText: string;
  images: { url: string; docType: string }[];
}

export const SubjectImageViewer: FC<Props> = ({ isLoading, ocrText, images }) => {
  return (
    <>
      <ImageViewer>
        <ImageViewer.ZoomModal />
        <ImageViewer.SelectedImage
          initialImage={isLoading || !images?.[0]?.url ? '' : images[0].url}
          ZoomButton={props => (
            <MagnifyingGlassButton
              {...props}
              sx={{
                position: 'absolute',
                bottom: '1rem',
                right: '1rem',
              }}
            />
          )}
          OcrButton={props => (
            <OcrButton
              {...props}
              sx={{
                position: 'absolute',
                bottom: '1rem',
                right: '3.5rem',
              }}
            />
          )}
        />
        <ImageViewer.ImageList>
          {!isLoading &&
            images?.map(({ url, docType }) => (
              <ImageViewer.ImageItem
                key={`${url}${docType}`}
                src={url}
                caption={docType}
                alt={docType}
                buttonProps={{
                  sx: {
                    textTransform: 'capitalize',
                  },
                }}
              />
            ))}
        </ImageViewer.ImageList>
      </ImageViewer>
      <OcrToggle ocrText={ocrText} />
    </>
  );
};
