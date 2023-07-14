import { forwardRef, ImgHTMLAttributes, Suspense } from 'react';
import { ctw } from '@utils/ctw';
import { useImage, useImageProps } from 'react-image';
import { Skeleton } from '@components/atoms/Skeleton';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: useImageProps['srcList'];
  useImageProps?: Omit<useImageProps, 'srcList'>;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ className, alt, src: srcList, useImageProps, ...props }, ref) => {
    const { src } = useImage({
      ...useImageProps,
      srcList,
    });

    return (
      <Suspense
        fallback={
          <figure aria-live={`polite`}>
            <Skeleton className={className} />
            <figcaption className={`sr-only`}>Loading image...</figcaption>
          </figure>
        }
      >
        <img className={ctw(className)} alt={alt} src={src} {...props} ref={ref} />
      </Suspense>
    );
  },
);
Image.displayName = 'Image';
