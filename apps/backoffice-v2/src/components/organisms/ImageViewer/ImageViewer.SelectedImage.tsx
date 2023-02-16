import { forwardRef, useCallback, useState } from 'react';
import { ISelectedImageProps } from './interfaces';
import { useSelectedImage } from './hooks/useSelectedImage/useSelectedImage';
import { BallerineImage } from 'components/atoms/BallerineImage';
import { ctw } from '../../../utils/ctw/ctw';
import {useConsole} from "hooks/useConsole/useConsole";

/**
 * @description To be used by {@link ImageViewer}. Uses {@link BallerineImage} to display the currently selected image with default styling.
 *
 * @param props
 * @param props.imageProps - Props to pass to the {@link BallerineImage} component.
 * @param props.initialImage - The initial image to display if no image was selected yet.
 * @param props.ZoomButton - A button that opens the zoom modal when clicked, receives an onClick handler from {@link useImageViewerContext}.
 * @constructor
 */
export const SelectedImage = forwardRef<HTMLImageElement, ISelectedImageProps>(
  ({ className, isLoading, initialImage, ...props }, ref) => {
    const { selectedImage } = useSelectedImage(initialImage);
    const [isError, setIsError] = useState(false);
    const onError = useCallback(() => {
      setIsError(true);
    }, []);
    const isPlaceholder = isLoading || !selectedImage || isError;

    useConsole({
      isPlaceholder,
      isLoading,
      selectedImage,
      isError,
    })

    return (
      <BallerineImage
        withPlaceholder
        src={selectedImage}
        alt={'Selected image'}
        className={ctw(className, {
          'h-[600px] w-[441px]': isPlaceholder,
        })}
        ref={ref}
        isLoading={isLoading}
        onError={onError}
        {...props}
      />
    );
  },
);
