import { reportAdapter } from '@/components';

export const createReportAdapter = ({ reportVersion }: { reportVersion: string }) => {
  return reportAdapter[`v${reportVersion}` as keyof typeof reportAdapter] ?? reportAdapter.DEFAULT;
};
