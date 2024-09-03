import * as React from 'react';
import { ElementRef, forwardRef } from 'react';
import { Image } from '@ballerine/ui';
import { ExtractCellProps } from '@ballerine/blocks';

export const ImageCell = forwardRef<ElementRef<typeof Image>, ExtractCellProps<'image'>>(
  ({ value, props }, ref) => {
    return <Image {...props} src={value} ref={ref} />;
  },
);

ImageCell.displayName = 'ImageCell';
