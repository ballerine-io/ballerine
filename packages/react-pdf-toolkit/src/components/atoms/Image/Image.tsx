import { ImageProps } from '@/components/atoms/Image/types';
import { mergeStyles } from '@/utils/merge-styles';
import { Image as ImageComponent } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export const Image: FunctionComponent<ImageProps> = ({ width, height, src, styles = [] }) => (
  <ImageComponent
    style={mergeStyles([{ width: `${width}px`, height: `${height}px` }, styles])}
    src={src}
  />
);
