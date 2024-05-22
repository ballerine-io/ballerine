import { Button } from '@/common/components/atoms/Button/Button';
import { useDownloadReportButtonLogic } from '@/pages/BusinessesAlertsAnalysis/components/OngoingMonitoringTable/components/DownloadReportButton/useDownloadReportButtonLogic';
import { Download } from 'lucide-react';
import { FunctionComponent } from 'react';

interface IDownloadReportButtonProps {
  fileId: string;
  reportId: string;
}

export const DownloadReportButton: FunctionComponent<IDownloadReportButtonProps> = ({
  fileId,
  reportId,
}) => {
  const { isDownloading, downloadReport } = useDownloadReportButtonLogic({ fileId, reportId });

  return (
    <Button variant="ghost" size="icon" disabled={isDownloading} onClick={downloadReport}>
      <Download color="#007AFF" />
    </Button>
  );
};
