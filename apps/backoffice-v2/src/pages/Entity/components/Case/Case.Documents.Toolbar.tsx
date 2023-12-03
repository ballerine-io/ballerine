import { FunctionComponent } from 'react';
import { isPdf } from '@/common/utils/is-pdf/is-pdf';
import { ctw } from '@/common/utils/ctw/ctw';
import { Download, ExternalLinkIcon, FileText } from 'lucide-react';
import { ImageViewer } from '@/common/components/organisms/ImageViewer/ImageViewer';

export const DocumentsToolbar: FunctionComponent<{
  image: { id: string; imageUrl: string; fileType: string; fileName: string };
  isLoading?: boolean;
  hideOpenExternalButton?: boolean;
  onRotateDocument: () => void;
  onOpenDocumentInNewTab: (id: string) => void;
  shouldDownload: boolean;
  fileToDownloadBase64: string;
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
        </>
      )}
      <a
        className={ctw(
          `btn btn-circle btn-ghost btn-sm bg-base-300/70 text-[0.688rem] focus:outline-primary`,
          {
            'pointer-events-none opacity-50': !shouldDownload,
          },
        )}
        download={image?.fileName}
        href={fileToDownloadBase64}
      >
        <Download className={`p-0.5`} />
      </a>
      {!isLoading && <ImageViewer.ZoomButton disabled={shouldDownload} />}
    </div>
  );
};
