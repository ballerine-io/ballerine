import { TextWithNAFallback } from '@/common/components/atoms/TextWithNAFallback/TextWithNAFallback';
import { ctw } from '@/common/utils/ctw/ctw';
import { TBusinessReport } from '@/domains/business-reports/fetchers';
import { getSeverityFromRiskScore } from '@/pages/BusinessesAlerts/components/BusinessAlertsTable/utils/get-severity-from-risk-score';
import { OpenUrlInNewTabButton } from '@/common/components/atoms/OpenUrlInNewTabButton/OpenUrlInNewTabButton';
import {
  severityToClassName,
  severityToTextClassName,
} from '@/pages/TransactionMonitoringAlerts/components/AlertsTable/severity-to-class-name';
import { Badge } from '@ballerine/ui';
import { createColumnHelper } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { titleCase } from 'string-ts';
import { useStorageFileByIdQuery } from '@/domains/storage/hooks/queries/useStorageFileByIdQuery/useStorageFileByIdQuery';

const columnHelper = createColumnHelper<TBusinessReport>();

export const columns = [
  columnHelper.accessor('createdAt', {
    cell: info => {
      const dateValue = info.getValue();
      const date = dayjs(dateValue).format('MMM DD, YYYY');
      const time = dayjs(dateValue).format('hh:mm');

      return (
        <div className={`flex flex-col space-y-0.5`}>
          <span className={`font-semibold`}>{date}</span>
          <span className={`text-xs text-[#999999]`}>{time}</span>
        </div>
      );
    },
    header: 'Date & Time',
  }),
  columnHelper.accessor('riskScore', {
    cell: info => {
      const riskScore = info.getValue();
      const severity = getSeverityFromRiskScore(riskScore);

      return (
        <div className="flex items-center gap-2">
          <TextWithNAFallback
            className={ctw(
              severityToTextClassName[
                (severity?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
              ],
              'py-0.5 font-bold',
            )}
          >
            {riskScore}
          </TextWithNAFallback>
          <TextWithNAFallback
            as={Badge}
            className={ctw(
              severityToClassName[
                (severity?.toUpperCase() as keyof typeof severityToClassName) ?? 'DEFAULT'
              ],
              'w-20 py-0.5 font-bold',
            )}
          >
            {titleCase(severity ?? '')}
          </TextWithNAFallback>
        </div>
      );
    },
    header: 'Risk Score',
  }),
  columnHelper.accessor('report.reportFileId', {
    cell: info => {
      const reportFileId = info.getValue();
      // eslint-disable-next-line react-hooks/rules-of-hooks -- ESLint doesn't like `cell` not being `Cell`.
      const { data: signedUrl } = useStorageFileByIdQuery(reportFileId ?? '', {
        isEnabled: !!reportFileId,
        withSignedUrl: true,
      });

      return <OpenUrlInNewTabButton href={signedUrl ?? ''} />;
    },
    header: '',
  }),
];
