import { TImageViewerState } from './types';
import { FunctionComponent, PropsWithChildren, useCallback, useState } from 'react';
import { Context } from './Context';
import { useToggle } from '@pankod/refine-mantine';

/**
 * @description Shares state and actions between ImageViewer's children.
 * @param children
 * @constructor
 */
export const Provider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [selectedImage, setSelectedImage] = useState('');
  const onSelectImage = useCallback((src: string) => () => setSelectedImage(src), []);

  const [isZoomModalOpen, setIsZoomModalOpen] = useToggle();
  const toggleOnZoomModal = useCallback(() => setIsZoomModalOpen(true), [setIsZoomModalOpen]);
  const toggleOffZoomModal = useCallback(() => setIsZoomModalOpen(false), [setIsZoomModalOpen]);

  const value: TImageViewerState = {
    selectedImage,
    onSelectImage,
    isZoomModalOpen,
    toggleOnZoomModal,
    toggleOffZoomModal,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
