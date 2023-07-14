import { forwardRef, Suspense } from 'react';
import { ctw } from '@utils/ctw';
import { useImage } from 'react-image';
import { Skeleton } from '@components/atoms/Skeleton';
import { ErrorBoundary } from 'react-error-boundary';
import { ImageIcon } from 'lucide-react';
import { ImageProps } from '@components/atoms/Image/interfaces';

export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ className, alt, width, height, src: srcList, useImageProps, ...props }, ref) => {
    const { src } = useImage({
      ...useImageProps,
      srcList,
    });

    return (
      <ErrorBoundary
        fallback={
          <figure
            className={`border-destructive flex flex-col items-center justify-center space-y-2 rounded-md border p-1`}
            style={{ width, height }}
            aria-live={`polite`}
          >
            <ImageIcon className={`stroke-destructive h-[calc(1rem+15%)] w-[calc(1rem+15%)]`} />
            <figcaption className={`text-destructive`}>
              An error occurred while loading the image
            </figcaption>
          </figure>
        }
      >
        <Suspense
          fallback={
            <figure aria-live={`polite`} style={{ width, height }}>
              <Skeleton className={`h-full w-full`} />
              <figcaption className={`sr-only`}>Loading image...</figcaption>
            </figure>
          }
        >
          <img
            alt={alt}
            src={src}
            width={width}
            height={height}
            className={ctw(`rounded-md`, className)}
            {...props}
            ref={ref}
          />
        </Suspense>
      </ErrorBoundary>
    );
  },
);
Image.displayName = 'Image';
