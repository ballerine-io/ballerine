import { useImageViewerContext } from '@/components/organisms/ImageViewer/hooks/useImageViewerContext/useImageViewerContext';
import { useCallback } from 'react';

export const useZoomButton = () => {
  const { toggleOnIsZoomModalOpen } = useImageViewerContext();
  // Avoids passing the onClick event to the toggle callback.
  const onToggleOnIsZoomModalOpen = useCallback(() => {
    toggleOnIsZoomModalOpen();
  }, [toggleOnIsZoomModalOpen]);

  return {
    onToggleOnIsZoomModalOpen,
  };
};
