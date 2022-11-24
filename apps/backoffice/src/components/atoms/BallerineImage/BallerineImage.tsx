import { Image, Skeleton } from '@pankod/refine-mantine';
import React, { forwardRef } from 'react';
import { IBallerineImageProps } from './interfaces';

/**
 * @description Mantine's Image component with default styling, and a Skeleton placeholder.
 *
 * References:
 * - [Image documentation](https://mantine.dev/core/image/)
 * - [Skeleton documentation](https://mantine.dev/core/skeleton/)
 *
 * @param props
 * @param props.skeletonProps - Props to pass to the Skeleton component.
 * @constructor
 */
export const BallerineImage = forwardRef<HTMLImageElement, IBallerineImageProps>((props, ref) => {
  const { alt, src, sx, radius = 4, skeletonProps = {}, ...rest } = props;
  const { sx: skeletonSx, ...skeletonRest } = skeletonProps;

  return (
    <Image
      radius={radius}
      placeholder={<Skeleton sx={{ width: '100%', height: '100%', ...skeletonSx }} {...skeletonRest} />}
      withPlaceholder
      alt={alt}
      src={src}
      fit={'fill'}
      sx={{
        // Ensures the alt text doesn't overflow
        wordWrap: 'break-word',
        ...sx,
      }}
      imageRef={ref}
      {...rest}
    />
  );
});

BallerineImage.displayName = 'BallerineImage';
