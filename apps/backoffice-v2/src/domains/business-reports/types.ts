import { TObjectValues } from '@/common/types';
import { AdsProvider } from '@/domains/business-reports/constants';

export type TBusinessReportType = ('MERCHANT_REPORT_T1' | 'ONGOING_MERCHANT_REPORT_T1') &
  string & {};

export type TAdsProvider = TObjectValues<typeof AdsProvider>;

export type TAdsProviders = TAdsProvider[];
