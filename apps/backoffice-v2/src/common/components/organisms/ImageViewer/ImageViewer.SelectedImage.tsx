import { isCsv } from '@/common/utils/is-csv/is-csv';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { ctw } from '../../../utils/ctw/ctw';
import { isPdf } from '../../../utils/is-pdf/is-pdf';
import { BallerineImage } from '../../atoms/BallerineImage';
import { useSelectedImage } from './hooks/useSelectedImage/useSelectedImage';
import { TSelectedImageProps } from './interfaces';

/**
 * @description To be used by {@link ImageViewer}. Uses {@link BallerineImage} to display the currently selected image with default styling.
 *
 * @param props
 * @param props.imageProps - Props to pass to the {@link BallerineImage} component.
 * @param props.initialImage - The initial image to display if no image was selected yet.
 * @param props.ZoomButton - A button that opens the zoom modal when clicked, receives an onClick handler from {@link useImageViewerContext}.
 * @constructor
 */
export const SelectedImage = forwardRef<HTMLImageElement | HTMLIFrameElement, TSelectedImageProps>(
  ({ className, isLoading, initialImage, ...props }, ref) => {
    const { selectedImage } = useSelectedImage(initialImage);

    const [isError, setIsError] = useState(false);
    const onError = useCallback(() => {
      setIsError(true);
    }, []);

    const isPlaceholder = isLoading || !selectedImage?.imageUrl || isError;

    useEffect(() => {
      if (!isError || !selectedImage?.imageUrl) return;

      setIsError(false);
    }, [isError, selectedImage?.imageUrl]);

    if (isPdf(selectedImage) || isCsv(selectedImage)) {
      return (
        <iframe
          src={`${selectedImage?.imageUrl}#toolbar=0&navpanes=0`}
          ref={ref}
          className={ctw(className, `d-full mx-auto`, {
            'h-[600px] w-[600px]': isPlaceholder,
          })}
          {...props}
        />
      );
    }

    return (
      <BallerineImage
        withPlaceholder
        src={selectedImage?.imageUrl}
        alt={'Selected image'}
        className={ctw(className, `mx-auto`, {
          '!h-[600px] !w-[600px]': isPlaceholder,
        })}
        ref={ref}
        isLoading={isLoading}
        onError={onError}
        {...props}
      />
    );
  },
);

SelectedImage.displayName = 'SelectedImage';
