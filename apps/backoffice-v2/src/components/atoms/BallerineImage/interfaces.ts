import { ComponentProps } from 'react';

export interface IBallerineImageProps extends Omit<ComponentProps<'img'>, 'alt' | 'src'> {
  src: string;
  alt: string;
  isLoading?: boolean;
  withPlaceholder?: boolean;
}
