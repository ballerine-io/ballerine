import { reportAdapter } from '@/domains/business-reports/adapters/report-adapter/report-adapter';

export const createReportAdapter = ({ reportVersion }: { reportVersion: number }) => {
  return reportAdapter[`v${reportVersion}` as keyof typeof reportAdapter] ?? reportAdapter.DEFAULT;
};
