import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { markBusinessReportAsReviewed } from '@/domains/business-reports/fetchers';
import { HttpError } from '@/common/errors/http-error';
import { businessReportsQueryKey } from '@/domains/business-reports/query-keys';

export const useMarkBusinessReportAsReviewedMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string }) => {
      return await markBusinessReportAsReviewed(data);
    },
    onSuccess: data => {
      // @TODO: Update the business report status to `completed`
      void queryClient.invalidateQueries(businessReportsQueryKey._def);

      toast.success('Business report marked as reviewed');
    },
    onError: (error: unknown) => {
      if (error instanceof HttpError && error.code === 400) {
        toast.error(error.message);

        return;
      }

      toast.error('Failed to mark business report as reviewed');
    },
  });
};
