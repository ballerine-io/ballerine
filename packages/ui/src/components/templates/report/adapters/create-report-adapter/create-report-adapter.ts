import { reportAdapter } from '@/components';

// Right now there is no `version` property on business reports.
export const createReportAdapter = ({ reportVersion }: { reportVersion: number }) => {
  return reportAdapter[`v${reportVersion}` as keyof typeof reportAdapter] ?? reportAdapter.DEFAULT;
};
