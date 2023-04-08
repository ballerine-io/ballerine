import 'react-image-crop/dist/ReactCrop.css';
import { FunctionComponent } from 'react';
import { ImageViewer } from '@/components/organisms/ImageViewer/ImageViewer';
import { IDocumentsProps } from '@/components/organisms/Subject/interfaces';
import ReactCrop from 'react-image-crop';
import { XMarkSvg } from '@/components/atoms/icons';
import { useDocuments } from '@/components/organisms/Subject/hooks/useDocuments/useDocuments';
import { ctw } from '@/utils/ctw/ctw';
import { Button } from '@/components/atoms/Button';
import {Check, X} from 'lucide-react';

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
  } = useDocuments(documents);

  return (
    <ImageViewer>
      <div className={`flex min-h-[600px] flex-col items-center`}>
        <div
          className={`
            relative max-w-[441px] rounded-md`}
        >
          <ReactCrop crop={crop} onChange={onCrop} disabled={!isCropping}>
            <ImageViewer.SelectedImage
              initialImage={initialImage}
              ref={selectedImageRef}
              isLoading={isLoading}
            />
          </ReactCrop>
          <div className={`absolute z-50 flex space-x-2 bottom-right-6`}>
            <Button
              variant={`ghost`}
              shape={'circle'}
              className={ctw(`bg-base-300/70`, {
                hidden: !isCropping,
              })}
              onClick={onCancelCrop}
            >
              <X />
            </Button>
            <Button
              variant={`ghost`}
              shape={'circle'}
              type={`button`}
              className={ctw(`bg-base-300/70 !p-2 text-[0.688rem]`, { loading: isLoadingOCR })}
              onClick={onOcr}
              disabled={isLoading}
            >
              {isCropping && !isLoadingOCR && <Check className={`p-0.5`} />}
              {!isCropping && !isLoadingOCR && <span className={`p-0.5`}>OCR</span>}
            </Button>
            <ImageViewer.ZoomButton disabled={isLoading} />
          </div>
        </div>
      </div>
      <ImageViewer.List>
        {isLoading
          ? skeletons.map(index => (
              <ImageViewer.SkeletonItem key={`image-viewer-skeleton-${index}`} />
            ))
          : documents.map(({ imageUrl, caption }) => (
              <ImageViewer.Item
                key={`${imageUrl}-${caption}`}
                src={imageUrl}
                alt={caption}
                caption={caption}
              />
            ))}
      </ImageViewer.List>
      <ImageViewer.ZoomModal />
    </ImageViewer>
  );
};
