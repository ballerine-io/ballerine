import { HTMLProps, PropsWithChildren } from 'react';
import { ButtonProps, ImageProps } from '@pankod/refine-mantine';

export interface ISelectedImageProps extends PropsWithChildren, ButtonProps {
  imageProps?: Omit<ImageProps, 'src'>;
  // The image to show before a selection is made by the user.
  initialImage: string;
  // Used to open the selected image's modal.
  ZoomButton: <TProps extends HTMLProps<HTMLButtonElement> & { onClick: () => void }>(props: TProps) => JSX.Element;
  OcrButton: <TProps extends HTMLProps<HTMLButtonElement> & { onClick: () => void, isSubmittable: boolean }>(props: TProps) => JSX.Element;
}
