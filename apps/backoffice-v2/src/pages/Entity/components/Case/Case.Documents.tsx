import 'react-image-crop/dist/ReactCrop.css';
import { ComponentProps, FunctionComponent } from 'react';
import { ImageViewer } from '../../../../common/components/organisms/ImageViewer/ImageViewer';
import { IDocumentsProps } from './interfaces';
import { useDocuments } from './hooks/useDocuments/useDocuments';
import { ctw } from '../../../../common/utils/ctw/ctw';
import ReactCrop, { Crop } from 'react-image-crop';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Download, ExternalLinkIcon, FileText } from 'lucide-react';
import { isPdf } from '../../../../common/utils/is-pdf/is-pdf';
import { DownloadFile } from '@/common/components/molecules/DownloadFile/DownloadFile';
import { FunctionComponentWithChildren } from '@/common/types';

interface IImageEditorProps {
  onTransformed: NonNullable<ComponentProps<typeof TransformWrapper>['onTransformed']>;
  image: { imageUrl: string; fileType: string; id: string };
  crop: Crop | undefined;
  onCrop: (crop: Crop) => void;
  // onCancelCrop: (crop: Crop) => void;
  isCropping: boolean;
  isRotatedOrTransformed: boolean;
  documentRotation: number;
}

const ImageEditor: FunctionComponentWithChildren<IImageEditorProps> = ({
  children,
  onTransformed,
  image,
  crop,
  onCrop,
  // onCancelCrop,
  isCropping,
  isRotatedOrTransformed,
  documentRotation,
}) => {
  return (
    <TransformWrapper onTransformed={onTransformed}>
      <TransformComponent
        wrapperClass={`max-w-[441px]`}
        contentClass={ctw(`overflow-x-auto`, {
          'hover:cursor-move': !isPdf(image),
        })}
        wrapperStyle={{
          width: '100%',
          height: '100%',
        }}
        contentStyle={{
          width: '100%',
          height: '100%',
        }}
      >
        <ReactCrop
          crop={crop}
          onChange={onCrop}
          disabled={!isCropping || isPdf(image) || isRotatedOrTransformed}
          className={ctw({
            'd-full [&>div]:d-full': isPdf(image),
            'rotate-90': documentRotation === 90,
            'rotate-180': documentRotation === 180,
            'rotate-[270deg]': documentRotation === 270,
          })}
        >
          {children}
        </ReactCrop>
      </TransformComponent>
    </TransformWrapper>
  );
};

const ImageToolbar: FunctionComponent<{
  image: { imageUrl: string; fileType: string; id: string };
  isLoading?: boolean;
  hideOpenExternalButton?: boolean;
  onRotateDocument: () => void;
  onOpenDocumentInNewTab: (id: string) => void;
  // isRotatedOrTransformed: boolean;
  shouldDownload: boolean;
  // isCropping: boolean;
  // isLoadingOCR: boolean;
}> = ({
  image,
  isLoading,
  hideOpenExternalButton,
  onRotateDocument,
  onOpenDocumentInNewTab,
  // isRotatedOrTransformed,
  shouldDownload,
  // isCropping,
  // isLoadingOCR,
  fileToDownloadBase64,
}) => {
  return (
    <div className={`absolute z-50 flex space-x-2 bottom-right-6`}>
      {!isPdf(image) && !isLoading && (
        <>
          {!hideOpenExternalButton && (
            <button
              type={`button`}
              className={ctw(
                `btn btn-circle btn-ghost btn-sm bg-base-300/70 text-[0.688rem] focus:outline-primary`,
              )}
              onClick={() => onOpenDocumentInNewTab(image.id)}
              disabled={shouldDownload}
            >
              <ExternalLinkIcon className={`p-0.5`} />
            </button>
          )}
          <button
            type={`button`}
            className={ctw(
              `btn btn-circle btn-ghost btn-sm bg-base-300/70 text-[0.688rem] focus:outline-primary`,
            )}
            onClick={onRotateDocument}
            disabled={shouldDownload}
          >
            <FileText className={`rotate-90 p-0.5`} />
          </button>
          {/*<button*/}
          {/*  className={ctw(*/}
          {/*    'btn btn-circle btn-ghost btn-sm bg-base-300/70 focus:outline-primary',*/}
          {/*    {*/}
          {/*      hidden: !isCropping,*/}
          {/*    },*/}
          {/*  )}*/}
          {/*  disabled={shouldDownload}*/}
          {/*  onClick={onCancelCrop}*/}
          {/*>*/}
          {/*  <XMarkSvg className={`p-0.5`} />*/}
          {/*</button>*/}
          {/*<div*/}
          {/*  title={*/}
          {/*    isRotatedOrTransformed*/}
          {/*      ? `Cannot OCR rotated, zoomed, panned, or pinched documents`*/}
          {/*      : undefined*/}
          {/*  }*/}
          {/*>*/}
          {/*  <button*/}
          {/*    type={`button`}*/}
          {/*    className={ctw(*/}
          {/*      `btn btn-circle btn-ghost btn-sm bg-base-300/70 text-[0.688rem] focus:outline-primary`,*/}
          {/*      { loading: isLoadingOCR },*/}
          {/*    )}*/}
          {/*    onClick={onOcr}*/}
          {/*    disabled={isRotatedOrTransformed || shouldDownload}*/}
          {/*  >*/}
          {/*    {isCropping && !isLoadingOCR && <CheckSvg className={`p-0.5`} />}*/}
          {/*    {!isCropping && !isLoadingOCR && <span className={`p-0.5`}>OCR</span>}*/}
          {/*  </button>*/}
          {/*</div>*/}
        </>
      )}
      <a
        className={ctw(
          `btn btn-circle btn-ghost btn-sm bg-base-300/70 text-[0.688rem] focus:outline-primary`,
          {
            'pointer-events-none opacity-50': !shouldDownload,
          },
        )}
        download={image?.imageUrl}
        href={fileToDownloadBase64}
      >
        <Download className={`p-0.5`} />
      </a>
      {!isLoading && <ImageViewer.ZoomButton disabled={shouldDownload} />}
    </div>
  );
};

/**
 * @description To be used by {@link Case}, and be wrapped by {@link Case.Content}. Displays a single entity's documents using {@link ImageViewer}. Displays documents[0].imageUrl if no document was selected yet.
 *
 * @param props
 * @param props.documents - An array of objects containing the document's image URL and caption to pass into {@link ImageViewer.Item}.
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
              documentRotation={documentRotation}
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
          <ImageToolbar
            image={selectedImage}
            isLoading={isLoading}
            hideOpenExternalButton={hideOpenExternalButton}
            onRotateDocument={onRotateDocument}
            onOpenDocumentInNewTab={onOpenDocumentInNewTab}
            // isRotatedOrTransformed={isRotatedOrTransformed}
            shouldDownload={shouldDownload}
            // isCropping={isCropping}
            // isLoadingOCR={isLoadingOCR}
            //   onCancelCrop={onCancelCrop}
            fileToDownloadBase64={fileToDownloadBase64}
          />
        </div>
      </div>
      <ImageViewer.List>
        {isLoading &&
          skeletons.map(index => (
            <ImageViewer.SkeletonItem key={`image-viewer-skeleton-${index}`} />
          ))}
        {!isLoading &&
          documents?.map(({ imageUrl, title, fileType, id }) => (
            <ImageViewer.Item
              id={id}
              key={`${imageUrl}-${title}`}
              src={imageUrl}
              fileType={fileType}
              alt={title}
              caption={title}
            />
          ))}
      </ImageViewer.List>
      <ImageViewer.ZoomModal />
    </ImageViewer>
  );
};
