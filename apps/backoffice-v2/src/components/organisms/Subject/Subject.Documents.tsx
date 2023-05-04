import 'react-image-crop/dist/ReactCrop.css';
import { FunctionComponent } from 'react';
import { ImageViewer } from 'components/organisms/ImageViewer/ImageViewer';
import { IDocumentsProps } from 'components/organisms/Subject/interfaces';
import { CheckSvg, XMarkSvg } from 'components/atoms/icons';
import { useDocuments } from 'components/organisms/Subject/hooks/useDocuments/useDocuments';
import { ctw } from '../../../utils/ctw/ctw';
import ReactCrop from 'react-image-crop';

/**
 * @description To be used by {@link Subject}, and be wrapped by {@link Subject.Content}. Displays a single end user's documents using {@link ImageViewer}. Displays documents[0].imageUrl if no document was selected yet.
 *
 * @param props
 * @param props.documents - An array of objects containing the document's image URL and caption to pass into {@link ImageViewer.Item}.
 *
 * @see {@link ImageViewer}
 *
 * @constructor
 */
export const Documents: FunctionComponent<IDocumentsProps> = ({ documents, isLoading }) => {
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
  } = useDocuments(documents);

  return (
    <ImageViewer selectedImage={selectedImage} onSelectImage={onSelectImage}>
      <div className={`flex min-h-[600px] w-full flex-col items-center`}>
        <div
          className={`
            d-full relative max-w-[441px] items-center rounded-md`}
        >
          <ReactCrop
            crop={crop}
            onChange={onCrop}
            disabled={!isCropping || selectedImage?.fileType === 'application/pdf'}
            className={ctw({
              'd-full [&>div]:d-full': selectedImage?.fileType === 'application/pdf',
            })}
          >
            <ImageViewer.SelectedImage
              key={initialImage?.imageUrl}
              initialImage={initialImage}
              ref={selectedImageRef}
              isLoading={isLoading}
            />
          </ReactCrop>
          <div className={`absolute z-50 flex space-x-2 bottom-right-6`}>
            {selectedImage?.fileType !== 'application/pdf' && (
              <>
                <button
                  className={ctw(
                    'btn-ghost btn-sm btn-circle btn bg-base-300/70 focus:outline-primary',
                    {
                      hidden: !isCropping,
                    },
                  )}
                  onClick={onCancelCrop}
                >
                  <XMarkSvg className={`p-0.5`} />
                </button>
                <button
                  type={`button`}
                  className={ctw(
                    `btn-ghost btn-sm btn-circle btn bg-base-300/70 text-[0.688rem] focus:outline-primary`,
                    { loading: isLoadingOCR },
                  )}
                  onClick={onOcr}
                  disabled={isLoading}
                >
                  {isCropping && !isLoadingOCR && <CheckSvg className={`p-0.5`} />}
                  {!isCropping && !isLoadingOCR && <span className={`p-0.5`}>OCR</span>}
                </button>
              </>
            )}
            <ImageViewer.ZoomButton disabled={isLoading} />
          </div>
        </div>
      </div>
      <ImageViewer.List>
        {isLoading
          ? skeletons.map(index => (
              <ImageViewer.SkeletonItem key={`image-viewer-skeleton-${index}`} />
            ))
          : documents.map(({ imageUrl, title, fileType }) => (
              <ImageViewer.Item
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
