import 'react-image-crop/dist/ReactCrop.css';
import { FunctionComponent } from 'react';
import { ImageViewer } from '../../../../common/components/organisms/ImageViewer/ImageViewer';
import { IDocumentsProps } from './interfaces';
import { useDocuments } from './hooks/useDocuments/useDocuments';
import { ctw } from '../../../../common/utils/ctw/ctw';
import ReactCrop from 'react-image-crop';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { ExternalLinkIcon, FileText } from 'lucide-react';
import { isPdf } from '../../../../common/utils/is-pdf/is-pdf';

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
          <TransformWrapper onTransformed={onTransformed}>
            <TransformComponent
              wrapperClass={`max-w-[441px]`}
              contentClass={ctw(`overflow-x-auto`, {
                'hover:cursor-move': !isPdf(selectedImage),
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
                disabled={!isCropping || isPdf(selectedImage) || isRotatedOrTransformed}
                className={ctw({
                  'd-full [&>div]:d-full': isPdf(selectedImage),
                  'rotate-90': documentRotation === 90,
                  'rotate-180': documentRotation === 180,
                  'rotate-[270deg]': documentRotation === 270,
                })}
              >
                <ImageViewer.SelectedImage
                  key={initialImage?.imageUrl}
                  initialImage={initialImage}
                  ref={selectedImageRef}
                  isLoading={isLoading}
                />
              </ReactCrop>
            </TransformComponent>
          </TransformWrapper>
          <div className={`absolute z-50 flex space-x-2 bottom-right-6`}>
            {!isPdf(selectedImage) && !isLoading && (
              <>
                {!hideOpenExternalButton && (
                  <button
                    type={`button`}
                    className={ctw(
                      `btn btn-circle btn-ghost btn-sm bg-base-300/70 text-[0.688rem] focus:outline-primary`,
                    )}
                    onClick={() => onOpenDocumentInNewTab(selectedImage.id)}
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
                {/*    disabled={isRotatedOrTransformed}*/}
                {/*  >*/}
                {/*    {isCropping && !isLoadingOCR && <CheckSvg className={`p-0.5`} />}*/}
                {/*    {!isCropping && !isLoadingOCR && <span className={`p-0.5`}>OCR</span>}*/}
                {/*  </button>*/}
                {/*</div>*/}
              </>
            )}
            {!isLoading && <ImageViewer.ZoomButton />}
          </div>
        </div>
      </div>
      <ImageViewer.List>
        {isLoading
          ? skeletons.map(index => (
              <ImageViewer.SkeletonItem key={`image-viewer-skeleton-${index}`} />
            ))
          : documents.map(({ imageUrl, title, fileType, id }) => (
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
