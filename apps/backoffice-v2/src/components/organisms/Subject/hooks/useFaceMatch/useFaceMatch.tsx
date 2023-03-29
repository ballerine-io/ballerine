import { useLayoutEffect } from 'react';
import { useFaceComparison } from '@/hooks/useFaceComparison/useFaceComparison';
import { useParams } from '@tanstack/react-router';

export const useFaceMatch = (isLoading?: boolean) => {
  const { endUserId } = useParams();
  const { faceARef, faceBRef, onCompareFaces, imagesLoaded, isComparing, faceSimilarity } =
    useFaceComparison();
  const imageQuality = 80;
  const imageQualityThreshold = 80;
  const faceSimilarityThreshold = 80;

  useLayoutEffect(() => {
    if (!imagesLoaded || isLoading) return;

    (async () => {
      await onCompareFaces();
    })();
  }, [isLoading, imagesLoaded, onCompareFaces, endUserId]);

  return {
    faceARef,
    faceBRef,
    onCompareFaces,
    faceSimilarity,
    imageQuality,
    isComparing,
    imageQualityThreshold,
    faceSimilarityThreshold,
  };
};
