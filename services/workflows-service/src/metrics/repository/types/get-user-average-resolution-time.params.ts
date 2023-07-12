import { BaseParams } from '@/metrics/common/types/base-query.params';

export interface GetUserAverageResolutionTimeParams extends BaseParams {
  userId: string | null;
}
