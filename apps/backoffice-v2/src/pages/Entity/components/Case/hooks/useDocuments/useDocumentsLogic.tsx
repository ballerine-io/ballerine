import { ComponentProps, useCallback, useRef, useState } from 'react';

import { IDocumentsProps } from '../../interfaces';
import { TransformWrapper } from 'react-zoom-pan-pinch';
import { useCrop } from '@/common/hooks/useCrop/useCrop';
import { DOWNLOAD_ONLY_MIME_TYPES } from '@/common/constants';
import { useFilterId } from '@/common/hooks/useFilterId/useFilterId';
import { useTesseract } from '@/common/hooks/useTesseract/useTesseract';
import { createArrayOfNumbers } from '@/common/utils/create-array-of-numbers/create-array-of-numbers';
import { useStorageFileByIdQuery } from '@/domains/storage/hooks/queries/useStorageFileByIdQuery/useStorageFileByIdQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

export const useDocumentsLogic = (documents: IDocumentsProps['documents']) => {
  const initialImage = documents?.[0];
  const { data: customer } = useCustomerQuery();
  const { crop, isCropping, onCrop, onCancelCrop } = useCrop();
  const selectedImageRef = useRef<HTMLImageElement>();
  const recognize = useTesseract();
  const filterId = useFilterId();

  const skeletons = createArrayOfNumbers(4);
  const [selectedImage, setSelectedImage] = useState<{
    imageUrl: string;
    fileType: string;
    fileName: string;
    id: string;
  }>();
  const onSelectImage = useCallback(
    (next: { imageUrl: string; fileType: string; fileName: string }) => () => {
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
      ref: Parameters<ComponentProps<typeof TransformWrapper>['onTransformed']>[0],
      state: Parameters<ComponentProps<typeof TransformWrapper>['onTransformed']>[1],
    ) => {
      setIsTransformed(state?.scale !== 1 || state?.positionX !== 0 || state?.positionY !== 0);
    },
    [],
  );

  const onOpenDocumentInNewTab = useCallback(
    documentId => {
      const baseUrl = location.href.split('?')[0];
      const url = `${baseUrl}/document/${documentId}?filterId=${filterId}`;

      window.open(url, '_blank');
    },
    [filterId],
  );

  const shouldDownload = DOWNLOAD_ONLY_MIME_TYPES.includes(selectedImage?.fileType);
  const { data: fileToDownloadBase64 } = useStorageFileByIdQuery(selectedImage?.id, {
    isEnabled: shouldDownload,
    withSignedUrl: false,
  });

  return {
    crop,
    onCrop,
    onCancelCrop,
    isCropping,
    isOCREnabled: !!customer?.features?.isDocumentOcrEnabled,
    selectedImageRef,
    initialImage,
    skeletons,
    selectedImage,
    onSelectImage,
    documentRotation,
    onRotateDocument,
    onOpenDocumentInNewTab,
    isRotatedOrTransformed,
    onTransformed,
    shouldDownload,
    fileToDownloadBase64,
  };
};
