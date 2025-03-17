import { Download, ExternalLinkIcon, FileText } from 'lucide-react';
import { FunctionComponent } from 'react';

import { ImageOCR } from '@/common/components/molecules/ImageOCR/ImageOCR';
import { ImageViewer } from '@/common/components/organisms/ImageViewer/ImageViewer';
import { ctw } from '@/common/utils/ctw/ctw';
import { isCsv } from '@/common/utils/is-csv/is-csv';
import { isPdf } from '@/common/utils/is-pdf/is-pdf';
import { useDocumentsToolbarLogic } from '@/pages/Entity/components/Case/hooks/useDocumentsToolbarLogic/useDocumentsToolbarLogic';
import { Tooltip } from '@/common/components/atoms/Tooltip/Tooltip';
import { TooltipContent } from '@/common/components/atoms/Tooltip/Tooltip.Content';
import { TooltipTrigger } from '@/common/components/atoms/Tooltip/Tooltip.Trigger';
import { TooltipProvider } from '@/common/components/atoms/Tooltip/Tooltip.Provider';

// Custom tooltip wrapper to avoid repetition
const ToolbarTooltip: FunctionComponent<{
  label: string;
  description?: string;
  children: React.ReactNode;
}> = ({ label, description, children }) => (
  <TooltipProvider delayDuration={300}>
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        side="top"
        align="center"
        className="max-w-[200px] p-2 text-xs backdrop-blur-sm"
      >
        <div className="font-medium">{label}</div>
        {description && <p className="mt-1 text-xs text-gray-700">{description}</p>}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

// Button style to ensure consistency
const toolbarButtonClass = `
  relative btn btn-circle btn-ghost btn-sm 
  bg-base-300/30 hover:bg-base-300/70 
  text-[0.688rem] 
  focus:outline-primary 
  backdrop-filter backdrop-blur-sm
  transition-all duration-200 
  transform hover:scale-105
  shadow-sm hover:shadow-md
`;

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
    <div
      className={`
       absolute bottom-4 right-4 z-50 
        flex items-center gap-4
        rounded-2xl 
        border border-gray-200/60 bg-white/95
        p-3 opacity-80
        shadow-lg
        backdrop-blur-md transition-all duration-300 
        hover:border-indigo-200/70 hover:opacity-100
        hover:shadow-xl
      `}
    >
      {/* Toolbar Button Group */}
      <div className="flex items-center justify-center gap-4">
        {/* OCR Button */}
        <div className="flex flex-col items-center">
          <ImageOCR
            isOcrDisabled={!isOCREnabled}
            onOcrPressed={onOcrPressed}
            isLoadingOCR={isLoadingOCR}
          />
          <span className="mt-1 whitespace-nowrap text-[11px] font-extrabold text-black ">
            AI OCR
          </span>
        </div>

        {/* Open in New Tab Button */}
        {!hideOpenExternalButton && !isLoading && image?.id && (
          <div className="flex flex-col items-center">
            <button
              type="button"
              className={ctw(toolbarButtonClass)}
              onClick={onOpenInNewTabClick}
              disabled={shouldDownload}
              aria-label="Open in new tab"
            >
              <ExternalLinkIcon className="p-0.5" />
            </button>
            <span className="mt-1 whitespace-nowrap text-[11px] font-extrabold text-black">
              Open
            </span>
          </div>
        )}

        {/* Rotate Document Button */}
        {!isPdf(image) && !isCsv(image) && !isLoading && (
          <div className="flex flex-col items-center">
            <button
              type="button"
              className={ctw(toolbarButtonClass)}
              onClick={onRotateDocument}
              disabled={shouldDownload}
              aria-label="Rotate document"
            >
              <FileText className="rotate-90 p-0.5" />
            </button>
            <span className="mt-1 whitespace-nowrap text-[11px] font-extrabold text-black">
              Rotate
            </span>
          </div>
        )}

        {/* Download Document Button */}
        <div className="flex flex-col items-center">
          <a
            className={ctw(toolbarButtonClass)}
            download={image?.fileName}
            href={fileToDownloadBase64}
            aria-label="Download document"
          >
            <Download className="p-0.5" />
          </a>

          <span className="mt-1 whitespace-nowrap text-[11px] font-extrabold text-black">
            Download
          </span>
        </div>

        {/* Zoom Document Button */}
        {!isLoading && (
          <div className="flex flex-col items-center">
            <ImageViewer.ZoomButton disabled={shouldDownload} className={ctw(toolbarButtonClass)} />
            <span className="mt-1 whitespace-nowrap text-[11px] font-extrabold text-black">
              Zoom
            </span>
          </div>
        )}
      </div>

      {/* Subtle bounce indicator to draw attention */}
      <div className="absolute -top-2 left-1/2 h-1 w-1 -translate-x-1/2 animate-bounce rounded-full bg-white/80 opacity-0 group-hover:opacity-100" />
    </div>
  );
};
