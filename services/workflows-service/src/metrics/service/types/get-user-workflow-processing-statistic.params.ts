import { GetUserApprovalRateParams } from '@/metrics/repository/types/get-user-approval-rate.params';
import { GetUserAverageAssignmentTimeParams } from '@/metrics/repository/types/get-user-average-assignment-time.params';
import { GetUserAverageResolutionTimeParams } from '@/metrics/repository/types/get-user-average-resolution-time.params';
import { GetUserAverageReviewTimeParams } from '@/metrics/repository/types/get-user-average-review-time.params';

export type GetUserWorkflowProcessingStatisticParams = GetUserApprovalRateParams &
  GetUserAverageAssignmentTimeParams &
  GetUserAverageResolutionTimeParams &
  GetUserAverageReviewTimeParams;
