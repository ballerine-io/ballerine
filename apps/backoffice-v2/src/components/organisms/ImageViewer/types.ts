import { ComponentProps } from 'react';

export type TImageViewerState =
  | {
      selectedImage: string;
      onSelectImage: (src: string) => () => void;
      isZoomModalOpen: boolean;
      toggleIsZoomModalOpen: (next?: boolean) => void;
      toggleOnIsZoomModalOpen: (next?: boolean) => void;
    }
  | undefined;

export type TListProps = ComponentProps<'ul'>;
