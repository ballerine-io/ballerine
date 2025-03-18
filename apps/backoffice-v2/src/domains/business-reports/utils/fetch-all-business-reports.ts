import { toast } from 'sonner';
import {
  BusinessReportsFilterParams,
  BusinessReportsParams,
  TBusinessReport,
  fetchBusinessReports,
} from '../fetchers';
import { fetchAllPages, PaginatedResponse } from '@/common/utils/fetch-all-pages';

const EXPORT_PAGE_SIZE = 100; // Server denies more than 100 records per page

// Type-safe wrapper around fetchBusinessReports to match our pagination utility interface
const fetchBusinessReportsPage = async (
  params: BusinessReportsParams,
): Promise<PaginatedResponse<TBusinessReport>> => {
  const result = await fetchBusinessReports(params);
  if (!result) {
    throw new Error('Failed to fetch business reports');
  }
  return result;
};

/**
 * Fetches all business reports across all pages with the provided filters
 *
 * @param params - Filter parameters for the business reports
 * @param pageSize - Number of items per page (default: EXPORT_PAGE_SIZE)
 * @returns All business reports matching the filters
 */
export const fetchAllBusinessReports = async (
  params: BusinessReportsFilterParams,
  pageSize = EXPORT_PAGE_SIZE,
): Promise<TBusinessReport[]> => {
  try {
    let progressToast: string | number | undefined;

    return await fetchAllPages<TBusinessReport, BusinessReportsParams>(
      fetchBusinessReportsPage,
      params,
      pageSize,
      (current, total, items) => {
        // Show first progress message
        if (total > 1 && current === 1) {
          progressToast = toast.loading(`Fetching ${items} records (page ${current}/${total})...`);
        }
        // Update progress
        else if (progressToast && current > 1) {
          toast.loading(`Fetching ${items} records (page ${current}/${total})...`, {
            id: progressToast,
          });
        }

        // Show completion message
        if (current === total && progressToast) {
          toast.success(`Successfully fetched all ${items} records`, {
            id: progressToast,
          });
        }
      },
    );
  } catch (error) {
    console.error('Failed to fetch all business reports:', error);
    toast.error('Failed to fetch all business reports');
    throw error;
  }
};
