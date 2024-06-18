import { ElementRef, forwardRef } from 'react';
import { ImageProps } from '@/common/components/atoms/Image/interfaces';
import { useImage } from 'react-image';
import { ctw } from '@/common/utils/ctw/ctw';

export const BaseImage = forwardRef<ElementRef<'img'>, ImageProps>(
  ({ className, alt, width, height, src: srcList, useImageProps, ...props }, ref) => {
    const { src } = useImage({
      ...useImageProps,
      srcList,
    });

    return (
      <img
        alt={alt}
        src={src}
        width={width}
        height={height}
        className={ctw(`rounded-md object-contain`, className)}
        {...props}
        ref={ref}
      />
    );
  },
);

BaseImage.displayName = 'BaseImage';
