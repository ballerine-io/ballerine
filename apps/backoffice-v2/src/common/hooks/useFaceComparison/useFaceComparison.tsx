import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import {
  computeFaceDescriptor,
  euclideanDistance,
  loadFaceRecognitionModel,
  utils,
} from 'face-api.js';
import { isTwoDimensionalArray } from '../../utils/is-two-dimensional-array/is-two-dimensional-array';
import { useToggle } from '../useToggle/useToggle';

export const useFaceComparison = () => {
  const [faceSimilarity, setFaceSimilarity] = useState(0);
  const faceARef = useRef<HTMLImageElement>();
  const faceBRef = useRef<HTMLImageElement>();
  const [faceALoaded, , toggleOnFaceALoaded] = useToggle();
  const [faceBLoaded, , toggleOnFaceBLoaded] = useToggle();
  const imagesLoaded = faceALoaded && faceBLoaded;
  const [isComparing, , toggleOnIsComparing, toggleOffIsComparing] = useToggle();
  const onCompareFaces = useCallback(async () => {
    try {
      if (!faceARef.current || !faceBRef.current) return;

      toggleOnIsComparing();

      await loadFaceRecognitionModel('https://justadudewhohacks.github.io/face-api.js/models');

      const [faceAResult, faceBResult] = await Promise.all([
        computeFaceDescriptor(faceARef.current),
        computeFaceDescriptor(faceBRef.current),
      ]);

      // Both elements can be Float32Array | Float32Array[] when faceapi.euclideanDistance expects Float32Array | number[].
      if (isTwoDimensionalArray(faceAResult) || isTwoDimensionalArray(faceBResult)) {
        throw new Error('Two dimensional arrays are not supported.');
      }

      let distance = utils.round(euclideanDistance(faceAResult, faceBResult));

      distance = Math.round((1 - distance) * 100 * 1.5);

      toggleOffIsComparing();

      setFaceSimilarity(distance > 100 ? 100 : distance);
    } catch (error) {
      console.error(error);
      toggleOffIsComparing();
    }
  }, [toggleOffIsComparing, toggleOnIsComparing]);

  useLayoutEffect(() => {
    if (!faceARef.current || !faceBRef.current) return;

    faceARef.current.onload = () => {
      toggleOnFaceALoaded();
    };
    faceBRef.current.onload = async () => {
      toggleOnFaceBLoaded();
    };
  }, [toggleOnFaceALoaded, toggleOnFaceBLoaded]);

  return {
    faceARef,
    faceBRef,
    onCompareFaces,
    imagesLoaded,
    faceALoaded,
    faceBLoaded,
    faceSimilarity,
    isComparing,
  };
};
