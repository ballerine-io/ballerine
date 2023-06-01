import { ComponentProps } from 'react';

export interface IAvatarProps extends ComponentProps<'div'> {
  src: string;
  alt: string;
  isLoading?: boolean;
}
