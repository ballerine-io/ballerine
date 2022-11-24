import { ButtonProps, ImageProps, ListItemProps } from '@pankod/refine-mantine';

export interface IImageItemProps extends Omit<ListItemProps, 'children'> {
  caption: string;
  src: string;
  alt: string;
  buttonProps?: ButtonProps;
  imageProps?: Omit<ImageProps, 'src'>;
}
