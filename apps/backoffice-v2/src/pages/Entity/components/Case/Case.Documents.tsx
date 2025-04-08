import { FunctionComponent } from 'react';
import 'react-image-crop/dist/ReactCrop.css';

import { DownloadFile } from '@/common/components/molecules/DownloadFile/DownloadFile';
import { ImageEditor } from '@/common/components/molecules/ImageEditor/ImageEditor';
import { ImageViewer } from '@/common/components/organisms/ImageViewer/ImageViewer';
import { ctw } from '@/common/utils/ctw/ctw';
import { isCsv } from '@/common/utils/is-csv/is-csv';
import { DocumentsToolbar } from '@/pages/Entity/components/Case/Case.Documents.Toolbar';
import { useDocumentsLogic } from './hooks/useDocuments/useDocumentsLogic';
import { IDocumentsProps } from './interfaces';
import { keyFactory } from '@/common/utils/key-factory/key-factory';

/**
 * @description To be used by {@link Case}, and be wrapped by {@link Case.Content}. Displays a single entity's documents using {@link ImageViewer}. Displays documents[0].imageUrl if no document was selected yet.
 *
 * @param props
 * @param props.documents - An array of objects containing the document's image URL and caption to pass into {@link ImageViewer.Item}.
 * @param props.isLoading - Whether the documents are still loading.
 * @param props.hideOpenExternalButton - Whether to hide the open external button.
 *
 * @see {@link ImageViewer}
 *
 * @constructor
 */
export const Documents: FunctionComponent<IDocumentsProps> = ({
  documents,
  onOcrPressed,
  isLoading,
  isDocumentEditable,
  isLoadingOCR,
  hideOpenExternalButton,
  wrapperClassName,
}) => {
  const {
    crop,
    onCrop,
    onCancelCrop,
    isCropping,
    selectedImageRef,
    initialImage,
    skeletons,
    selectedImage,
    onSelectImage,
    documentRotation,
    onRotateDocument,
    onOpenDocumentInNewTab,
    onTransformed,
    isRotatedOrTransformed,
    shouldDownload,
    isOCREnabled,
    fileToDownloadBase64,
  } = useDocumentsLogic(documents);

  return (
    <ImageViewer selectedImage={selectedImage} onSelectImage={onSelectImage}>
      <div className={`flex w-full flex-col items-center`}>
        <div className={ctw(`d-full relative flex rounded-md`, wrapperClassName)}>
          {!shouldDownload && (
            <ImageEditor
              image={selectedImage}
              crop={crop}
              onCrop={onCrop}
              isCropping={isCropping}
              isRotatedOrTransformed={isRotatedOrTransformed}
              imageRotation={documentRotation}
              onTransformed={onTransformed}
            >
              <ImageViewer.SelectedImage
                initialImage={initialImage}
                ref={selectedImageRef}
                isLoading={isLoading}
              />
            </ImageEditor>
          )}
          {shouldDownload && (
            <div className={`w-[441px]`}>
              <DownloadFile heading={selectedImage?.fileName} />
            </div>
          )}
          <DocumentsToolbar
            image={selectedImage}
            isLoading={isLoading}
            hideOpenExternalButton={hideOpenExternalButton}
            onRotateDocument={onRotateDocument}
            onOpenDocumentInNewTab={onOpenDocumentInNewTab}
            // isRotatedOrTransformed={isRotatedOrTransformed}
            shouldDownload={shouldDownload}
            isOCREnabled={!!isDocumentEditable && isOCREnabled}
            onOcrPressed={onOcrPressed}
            isLoadingOCR={!!isLoadingOCR}
            // isCropping={isCropping}
            // onCancelCrop={onCancelCrop}
            fileToDownloadBase64={fileToDownloadBase64}
          />
        </div>
      </div>
      <ImageViewer.List>
        {isLoading
          ? skeletons.map(index => (
              <ImageViewer.SkeletonItem key={`image-viewer-skeleton-${index}`} />
            ))
          : documents?.map(document => {
              const { imageUrl, title, fileType, fileName, id } = document;

              return !isCsv(document) ? (
                <ImageViewer.Item
                  id={id}
                  key={keyFactory(id, title, fileName, fileType)}
                  src={imageUrl}
                  fileType={fileType}
                  fileName={fileName}
                  alt={title}
                  caption={title}
                />
              ) : null;
            })}
      </ImageViewer.List>
      <ImageViewer.ZoomModal />
    </ImageViewer>
  );
};
