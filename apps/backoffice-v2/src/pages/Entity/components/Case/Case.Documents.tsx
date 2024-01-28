import 'react-image-crop/dist/ReactCrop.css';
import { FunctionComponent } from 'react';

import { ctw } from '@/common/utils/ctw/ctw';
import { IDocumentsProps } from './interfaces';
import { useDocuments } from './hooks/useDocuments/useDocuments';
import { ImageEditor } from '@/common/components/molecules/ImageEditor/ImageEditor';
import { ImageViewer } from '@/common/components/organisms/ImageViewer/ImageViewer';
import { DownloadFile } from '@/common/components/molecules/DownloadFile/DownloadFile';
import { DocumentsToolbar } from '@/pages/Entity/components/Case/Case.Documents.Toolbar';
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
  isLoading,
  hideOpenExternalButton,
}) => {
  const {
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
    onOpenDocumentInNewTab,
    onTransformed,
    isRotatedOrTransformed,
    shouldDownload,
    fileToDownloadBase64,
  } = useDocuments(documents);

  return (
    <ImageViewer selectedImage={selectedImage} onSelectImage={onSelectImage}>
      <div className={`flex min-h-[600px] w-full flex-col items-center`}>
        <div
          className={ctw(
            `
            d-full relative flex justify-center rounded-md`,
          )}
        >
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
                key={initialImage?.imageUrl}
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
            // isCropping={isCropping}
            // isLoadingOCR={isLoadingOCR}
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
          : documents?.map(({ imageUrl, title, fileType, fileName, id }) => (
              <ImageViewer.Item
                id={id}
                key={keyFactory(id, title, fileName, fileType, imageUrl)}
                src={imageUrl}
                fileType={fileType}
                fileName={fileName}
                alt={title}
                caption={title}
              />
            ))}
      </ImageViewer.List>
      <ImageViewer.ZoomModal />
    </ImageViewer>
  );
};
