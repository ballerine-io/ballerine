import { Download, ExternalLinkIcon, FileText } from 'lucide-react';
import { FunctionComponent } from 'react';

import { ImageOCR } from '@/common/components/molecules/ImageOCR/ImageOCR';
import { ImageViewer } from '@/common/components/organisms/ImageViewer/ImageViewer';
import { ctw } from '@/common/utils/ctw/ctw';
import { isCsv } from '@/common/utils/is-csv/is-csv';
import { isPdf } from '@/common/utils/is-pdf/is-pdf';
import { useDocumentsToolbarLogic } from '@/pages/Entity/components/Case/hooks/useDocumentsToolbarLogic/useDocumentsToolbarLogic';

export const DocumentsToolbar: FunctionComponent<{
  image: { id: string; imageUrl: string; fileType: string; fileName: string };
  isLoading?: boolean;
  hideOpenExternalButton?: boolean;
  onRotateDocument: () => void;
  onOpenDocumentInNewTab: (id: string) => void;
  shouldDownload: boolean;
  onOcrPressed?: () => void;
  isOCREnabled: boolean;
  isLoadingOCR: boolean;
  fileToDownloadBase64: string;
}> = ({
  image,
  isLoading,
  hideOpenExternalButton,
  onRotateDocument,
  onOpenDocumentInNewTab,
  onOcrPressed,
  shouldDownload,
  isLoadingOCR,
  isOCREnabled,
  fileToDownloadBase64,
}) => {
  const { onOpenInNewTabClick } = useDocumentsToolbarLogic({
    imageId: image?.id,
    hideOpenExternalButton,
    onOpenDocumentInNewTab,
  });

  return (
    <div className={`absolute bottom-4 right-4 z-50 flex space-x-2`}>
      <ImageOCR
        isOcrDisabled={!isOCREnabled}
        onOcrPressed={onOcrPressed}
        isLoadingOCR={isLoadingOCR}
      />
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
      {!isPdf(image) && !isCsv(image) && !isLoading && (
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
