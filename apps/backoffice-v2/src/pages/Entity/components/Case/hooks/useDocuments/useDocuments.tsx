import { useCrop } from '../../../../../../common/hooks/useCrop/useCrop';
import { useCallback, useRef, useState } from 'react';
import { useTesseract } from '../../../../../../common/hooks/useTesseract/useTesseract';
import { IDocumentsProps } from '../../interfaces';
import { createArrayOfNumbers } from '../../../../../../common/utils/create-array-of-numbers/create-array-of-numbers';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { useToggle } from '../../../../../../common/hooks/useToggle/useToggle';
import { ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch';

export const useDocuments = (documents: IDocumentsProps['documents']) => {
  const initialImage = documents?.[0];
  const {
    crop,
    isCropping,
    onCrop,
    cropImage,
    toggleOnIsCropping,
    toggleOffIsCropping,
    onCancelCrop,
  } = useCrop();
  const [isLoadingOCR, , toggleOnIsLoadingOCR, toggleOffIsLoadingOCR] = useToggle(false);
  const selectedImageRef = useRef<HTMLImageElement>();
  const recognize = useTesseract();
  const onOcr = useCallback(async () => {
    if (!isCropping) {
      toggleOnIsCropping();

      return;
    }

    toggleOnIsLoadingOCR();

    try {
      const croppedBase64 = await cropImage(selectedImageRef.current);
      const result = await recognize(croppedBase64);
      const text = result?.data?.text;

      if (!text) {
        throw new Error('No document OCR text found');
      }

      await navigator.clipboard.writeText(text);

      toast.success(t('toast:copy_to_clipboard', { text }));
    } catch (err) {
      console.error(err);

      toast.error(t('toast:ocr_document_error'));
    }

    toggleOffIsLoadingOCR();
    toggleOffIsCropping();
  }, [
    isCropping,
    toggleOnIsLoadingOCR,
    toggleOffIsLoadingOCR,
    toggleOffIsCropping,
    toggleOnIsCropping,
    cropImage,
    recognize,
  ]);
  const skeletons = createArrayOfNumbers(4);
  const [selectedImage, setSelectedImage] = useState<{
    imageUrl: string;
    fileType: string;
  }>();
  const onSelectImage = useCallback(
    (next: { imageUrl: string; fileType: string }) => () => {
      setSelectedImage(next);
    },
    [],
  );
  const [documentRotation, setDocumentRotation] = useState(0);
  const onRotateDocument = useCallback(() => {
    setDocumentRotation(prevState => (prevState >= 270 ? 0 : prevState + 90));
  }, []);
  const [isTransformed, setIsTransformed] = useState(false);
  const isRotatedOrTransformed = documentRotation !== 0 || isTransformed;
  const onTransformed = useCallback(
    (
      ref: ReactZoomPanPinchContentRef,
      state: ReactZoomPanPinchContentRef['instance']['transformState'],
    ) => {
      setIsTransformed(state?.scale !== 1 || state?.positionX !== 0 || state?.positionY !== 0);
    },
    [],
  );

  return {
    crop,
    onCrop,
    onCancelCrop,
    isCropping,
    onOcr,
    selectedImageRef,
    initialImage,
    skeletons,
    isLoadingOCR,
    selectedImage,
    onSelectImage,
    documentRotation,
    onRotateDocument,
    isRotatedOrTransformed,
    onTransformed,
  };
};
