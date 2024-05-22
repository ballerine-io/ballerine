import { octetToFileType } from '@/common/utils/octet-to-file-type/octet-to-file-type';
import { saveBase64AsFile } from '@/common/utils/save-base64-as-file/save-base64-as-file';
import { fetchFileContentById } from '@/domains/storage/fetchers';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

export const useDownloadReportButtonLogic = ({
  fileId,
  reportId,
}: {
  fileId: string;
  reportId: string;
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadReport = useCallback(async () => {
    setIsDownloading(true);

    try {
      setIsDownloading(true);
      const fileContent = await fetchFileContentById(fileId);

      const base64 = octetToFileType(fileContent as string, 'application/pdf');

      saveBase64AsFile(base64, `report-${reportId}.pdf`);
    } catch (error) {
      toast.error('Failed to download report.');
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    isDownloading,
    downloadReport,
  };
};
