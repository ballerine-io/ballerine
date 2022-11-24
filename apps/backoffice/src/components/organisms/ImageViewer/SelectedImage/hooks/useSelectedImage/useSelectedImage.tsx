import { useImageViewerContext } from '../../../context/hooks/useImageViewerContext/useImageViewerContext';
import { useEffect } from 'react';

/**
 * @description Encapsulates SelectedImage's state and logic in addition to setting the initial selected image on mount.
 * @param initialImage
 */
export const useSelectedImage = (initialImage: string) => {
  const { onSelectImage, selectedImage, toggleOnZoomModal } = useImageViewerContext();

  useEffect(() => {
    if (selectedImage) return;

    onSelectImage(initialImage)();
  }, [initialImage, selectedImage, onSelectImage]);

  return {
    selectedImage,
    toggleOnZoomModal,
  };
};
