import { useCallback } from 'react';
import { createWorker, ImageLike } from 'tesseract.js';

export const useTesseract = () => {
  return useCallback(async (image: ImageLike) => {
    // Create a worker
    const worker = await createWorker();

    // Initialize the worker
    await worker.loadLanguage('eng');
    await worker.initialize('eng');

    const result = await worker.recognize(image);

    void worker.terminate();

    // Recognize the image, return the result, and then terminate the worker
    return result;
  }, []);
};
