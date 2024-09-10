import { ImageIcon } from 'lucide-react';
import { BaseImage } from '@/components/atoms/Image/BaseImage';
import { ComponentProps, ElementRef, forwardRef, Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Skeleton } from '@/components';
import { ctw } from '@/common';

export const Image = forwardRef<ElementRef<'img'>, ComponentProps<typeof BaseImage>>(
  ({ width, height, ...props }, ref) => {
    return (
      <ErrorBoundary
        fallback={
          <figure
            aria-live={`polite`}
            {...props}
            className={ctw(
              `border-destructive flex flex-col items-center justify-center space-y-2 rounded-md border p-1`,
              props?.className,
            )}
            style={{ width, height, ...props?.style }}
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
            <figure aria-live={`polite`} {...props} style={{ width, height, ...props?.style }}>
              <Skeleton className={`h-full w-full bg-slate-200`} />
              <figcaption className={`sr-only`}>Loading image...</figcaption>
            </figure>
          }
        >
          <BaseImage width={width} height={height} {...props} ref={ref} />
        </Suspense>
      </ErrorBoundary>
    );
  },
);

Image.displayName = 'Image';
