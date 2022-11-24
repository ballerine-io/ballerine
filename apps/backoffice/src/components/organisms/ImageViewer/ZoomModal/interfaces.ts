import { ModalProps } from '@mantine/core';
import { ImageProps } from '@pankod/refine-mantine';

export interface IZoomModalProps extends Omit<ModalProps, 'onClose' | 'opened'> {
  imageProps?: Omit<ImageProps, 'src'>;
}
