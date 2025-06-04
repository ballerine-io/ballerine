import { MERCHANT_REPORT_TYPES_MAP, type MerchantReportType } from '@ballerine/common';
import dayjs from 'dayjs';

export const getVisitorsCountriesDateRange = (reportType: MerchantReportType): string => {
  const monthsToSubtract = reportType === MERCHANT_REPORT_TYPES_MAP.MERCHANT_REPORT_T1 ? 6 : 1;
  const startDate = dayjs().subtract(monthsToSubtract, 'month').format('MMM YYYY');
  const endDate = dayjs().format('MMM YYYY');
  return `${startDate} - ${endDate}`;
};
