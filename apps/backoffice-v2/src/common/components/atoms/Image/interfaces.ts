import { CSSProperties, ImgHTMLAttributes } from 'react';
import { useImageProps } from 'react-image';

export interface ImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src: useImageProps['srcList'];
  useImageProps?: Omit<useImageProps, 'srcList'>;
  width: CSSProperties['width'];
  height: CSSProperties['height'];
}
