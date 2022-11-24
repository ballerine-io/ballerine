export type TImageViewerState =
  | {
      selectedImage: string;
      onSelectImage: (src: string) => () => void;
      isZoomModalOpen: boolean;
      toggleOnZoomModal: () => void;
      toggleOffZoomModal: () => void;
    }
  | undefined;
