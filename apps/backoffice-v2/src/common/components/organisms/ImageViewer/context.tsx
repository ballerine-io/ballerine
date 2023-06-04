import { TImageViewerState } from './types';
import { createContext, FunctionComponent, PropsWithChildren } from 'react';
import { useToggle } from '../../../hooks/useToggle/useToggle';

/**
 * When context is undefined we know that we are outside the provider.
 */
export const Context = createContext<TImageViewerState>(undefined);

/**
 * @description Shares state and actions between ImageViewer's children.
 * @param children
 * @constructor
 */
export const Provider: FunctionComponent<
  PropsWithChildren<{
    selectedImage: {
      imageUrl: string;
      fileType: string;
    };
    onSelectImage: (next: { imageUrl: string; fileType: string }) => () => void;
  }>
> = ({ children, selectedImage, onSelectImage }) => {
  const [isZoomModalOpen, toggleIsZoomModalOpen, toggleOnIsZoomModalOpen] = useToggle();

  const value: TImageViewerState = {
    selectedImage,
    onSelectImage,
    toggleIsZoomModalOpen,
    toggleOnIsZoomModalOpen,
    isZoomModalOpen,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
