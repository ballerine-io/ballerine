import { useImageViewerContext } from '../useImageViewerContext/useImageViewerContext';
import { useEffect } from 'react';
import { useParams } from '@tanstack/react-router';

/**
 * @description Encapsulates SelectedImage's state and logic in addition to setting the initial selected image on mount.
 * @param initialImage
 */
export const useSelectedImage = (initialImage: { imageUrl: string; fileType: string }) => {
  const { onSelectImage, selectedImage, toggleOnIsZoomModalOpen } = useImageViewerContext();
  const { endUserId } = useParams();

  // Re-pick the initial image when the end user changes.
  useEffect(() => {
    onSelectImage(initialImage)();
  }, [endUserId]);

  // If no image was selected yet, select the initial image.
  useEffect(() => {
    if (selectedImage?.imageUrl) return;

    onSelectImage(initialImage)();
  }, [initialImage?.imageUrl, selectedImage?.imageUrl, onSelectImage]);

  return {
    selectedImage,
    toggleOnIsZoomModalOpen,
  };
};
