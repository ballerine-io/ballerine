import { ComponentProps } from 'react';

export type TImageViewerState =
  | {
      selectedImage: {
        imageUrl: string;
        fileType: string;
      };
      onSelectImage: (next: { imageUrl: string; fileType: string }) => () => void;
      isZoomModalOpen: boolean;
      toggleIsZoomModalOpen: (next?: boolean) => void;
      toggleOnIsZoomModalOpen: (next?: boolean) => void;
    }
  | undefined;

export type TListProps = ComponentProps<'ul'>;
