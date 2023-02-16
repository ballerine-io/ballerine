import { forwardRef, ReactEventHandler, useCallback, useState } from 'react';
import { IBallerineImageProps } from './interfaces';
import { isInstanceOfFunction } from '../../../utils/is-instance-of-function/is-instance-of-function';
import { PhotoSvg } from 'components/atoms/icons';
import { ctw } from '../../../utils/ctw/ctw';

/**
 * @description An img element with default styling, and a Skeleton placeholder.
 *
 * @param props
 * @constructor
 */
export const BallerineImage = forwardRef<
  HTMLImageElement,
  IBallerineImageProps
>(
  (
    {
      withPlaceholder,
      placeholder,
      alt,
      src,
      className,
      isLoading,
      onError,
      ...rest
    },
    ref,
  ) => {
    const [error, setError] = useState(false);
    const isError = !src || error;
    const isPlaceholder = withPlaceholder && isError;
    const handleError: ReactEventHandler<HTMLImageElement> = useCallback(
      e => {
        setError(true);

        if (!isInstanceOfFunction(onError)) return;

        onError(e);
      },
      [onError],
    );

    if (isLoading || isPlaceholder) {
      return (
        <div
          className={ctw(
            {
              'animate-pulse bg-gray-200 theme-dark:bg-neutral-focus':
                isLoading,
              'bg-neutral': !isLoading && isPlaceholder,
            },
            'rounded-md',
            className,
          )}
          title={alt}
          {...rest}
        >
          {isLoading
            ? null
            : placeholder || (
                <div className={`d-full grid place-content-center`}>
                  <PhotoSvg className={`d-8`} />
                </div>
              )}
        </div>
      );
    }

    return (
      <img
        alt={alt}
        src={src}
        className={ctw(
          // Ensures the alt text doesn't overflow
          `break-words rounded-md object-fill object-center`,
          className,
        )}
        ref={ref}
        onError={handleError}
        {...rest}
      />
    );
  },
);

BallerineImage.displayName = 'BallerineImage';
