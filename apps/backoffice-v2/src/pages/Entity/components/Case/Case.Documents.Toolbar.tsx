import { Download, ExternalLinkIcon, FileText } from 'lucide-react';
import { FunctionComponent } from 'react';

import { ctw } from '@/common/utils/ctw/ctw';
import { isPdf } from '@/common/utils/is-pdf/is-pdf';
import { ImageViewer } from '@/common/components/organisms/ImageViewer/ImageViewer';
import { useDocumentsToolbarLogic } from '@/pages/Entity/components/Case/hooks/useDocumentsToolbarLogic/useDocumentsToolbarLogic';

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
  shouldDownload,
  fileToDownloadBase64,
}) => {
  const { onOpenInNewTabClick } = useDocumentsToolbarLogic({
    imageId: image?.id,
    hideOpenExternalButton,
    onOpenDocumentInNewTab,
  });

  return (
    <div className={`absolute z-50 flex space-x-2 bottom-right-6`}>
      {!hideOpenExternalButton && !isLoading && image?.id && (
        <button
          type={`button`}
          className={ctw(
            `btn btn-circle btn-ghost btn-sm bg-base-300/70 text-[0.688rem] focus:outline-primary`,
          )}
          onClick={onOpenInNewTabClick}
          disabled={shouldDownload}
        >
          <ExternalLinkIcon className={`p-0.5`} />
        </button>
      )}
      {!isPdf(image) && !isLoading && (
        <>
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
