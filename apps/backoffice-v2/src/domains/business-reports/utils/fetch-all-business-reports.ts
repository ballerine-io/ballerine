import {
  BusinessReportsFilterParams,
  BusinessReportsParams,
  TBusinessReport,
  fetchBusinessReports,
} from '../fetchers';
import { fetchAllPages, PaginatedResponse } from '@/common/utils/fetch-all-pages';

const EXPORT_PAGE_SIZE = 1000; // Server denies more than 100 records per page

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
    return await fetchAllPages<TBusinessReport, BusinessReportsParams>(
      fetchBusinessReportsPage,
      params,
      pageSize,
    );
  } catch (error) {
    console.error('Failed to fetch all business reports:', error);
    throw error;
  }
};
