import { useCrop } from 'hooks/useCrop/useCrop';
import { useCallback, useRef, useState } from 'react';
import { useTesseract } from 'hooks/useTesseract/useTesseract';
import { IDocumentsProps } from 'components/organisms/Subject/interfaces';
import { createArrayOfNumbers } from '../../../../../utils/create-array-of-numbers/create-array-of-numbers';
import toast from 'react-hot-toast';
import { t } from 'i18next';
import { useToggle } from 'hooks/useToggle/useToggle';

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

      toast.success(t('toast:copy_to_clipboard', text));
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
  };
};
