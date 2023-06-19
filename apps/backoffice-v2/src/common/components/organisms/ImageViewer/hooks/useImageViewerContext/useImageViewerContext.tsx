import { Context } from '../../context';
import { useContext } from 'react';

/**
 * @description Provides access to the context's state and actions, checks if the provider is in use.
 */
export const useImageViewerContext = () => {
  const value = useContext(Context);

  if (!value) {
    throw new Error(
      'useImageViewerContext must be used within a ImageViewerContext. Did you forget to use the ImageViewer component?',
    );
  }

  return value;
};
