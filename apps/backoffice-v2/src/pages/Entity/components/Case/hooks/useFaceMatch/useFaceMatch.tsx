import { useLayoutEffect } from 'react';
import { useFaceComparison } from '../../../../../../common/hooks/useFaceComparison/useFaceComparison';
import { useParams } from 'react-router-dom';

export const useFaceMatch = (isLoading?: boolean) => {
  const { entityId } = useParams();
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
  }, [isLoading, imagesLoaded, onCompareFaces, entityId]);

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
